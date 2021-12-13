pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract RagingSantas is ERC721, Ownable {
    using SafeMath for uint256;
    using Address for address;

    // Provenance hash proving random distribution
    string public provHashMint;
    string public provHashMatch;
    string public baseURI;

    uint256 public matchSeed;
    uint256 public constant mintPrice = 0.03 ether;

    uint256 public totalGifts;
    uint256 public numberClaimed;

    uint256 public maxSupply;
    uint256 public maxFreeMints;
    uint256 public numberMinted;
    uint256 public numberFreeMints;

    struct Gift {
      uint256 gifterTokenId;
      uint256 gifteeTokenId;
      uint256 nftTokenId;
      address nftAddress;
      address gifter;
      address giftee;
      address gifteeDelegator;
      bool hasClaimed;
    }

    // Mapping from token ID to gifted gift
    mapping(uint256 => Gift) private _giftsByTID;

    // Mapping from token ID (to make a claim) to token ID tied to claimed gift
    mapping(uint256 => uint256) private _giftRefsToClaim;

    // Mapping address for whitelist membership (gets free mint)
    mapping(address => bool) public whitelist;

    // The Gift Pool
    uint256[] public giftPoolTokens;

    bool public mintActive;
    bool public claimActive;
    bool public claimPaused;
    
    //there is a lot to unpack here
    constructor(uint256 supply, uint256 freeMintsSupply) ERC721("Raging Santas", "RAGIN") {
      mintActive = false;
      claimActive = false;
      claimPaused = false;
      maxSupply = supply;
      maxFreeMints = freeMintsSupply;
    }

    function toString(uint256 value) internal pure returns (string memory) {
      if (value == 0) {
        return "0";
      }
      uint256 temp = value;
      uint256 digits;
      while (temp != 0) {
        digits++;
        temp /= 10;
      }
      bytes memory buffer = new bytes(digits);
      while (value != 0) {
        digits -= 1;
        buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
        value /= 10;
      }
      return string(buffer);
    }

    function activateMint() external onlyOwner {
        mintActive = true;
    }

    function activateClaim(uint256 seed) external onlyOwner {
        totalGifts = giftPoolTokens.length;
        require(totalGifts > 1);

        claimActive = true;
        matchSeed = seed;
        mintActive = false;

        // Fisher Yates Shuffle
        uint256 mLen = totalGifts - 1;
        for (uint256 i = 0; i < mLen; i++) {
          uint256 n = uint256(keccak256(abi.encodePacked(i + seed))) % (totalGifts);
          (giftPoolTokens[i], giftPoolTokens[n]) = (giftPoolTokens[n], giftPoolTokens[i]);
        }

        for (uint256 i = 0; i < mLen; i++) {
          _giftsByTID[giftPoolTokens[i]].gifteeTokenId = giftPoolTokens[i + 1];
          _giftRefsToClaim[giftPoolTokens[i + 1]] = giftPoolTokens[i];
        }
        _giftsByTID[giftPoolTokens[mLen]].gifteeTokenId = giftPoolTokens[0];
        _giftRefsToClaim[giftPoolTokens[0]] = giftPoolTokens[mLen];
    }

    function pauseClaim(bool value) external onlyOwner {
        claimPaused = value;
    }

    function setBaseURI(string calldata newURI) external onlyOwner {
        baseURI = newURI;
    }

    function setProvHashMint(string calldata newHash) external onlyOwner {
        provHashMint = newHash;
    }
    
    function setProvHashMatch(string calldata newHash) external onlyOwner {
        provHashMatch = newHash;
    }

    function addWhitelist(address[] calldata addresses) external onlyOwner {
      for(uint256 i = 0; i < addresses.length; i++) {
        whitelist[addresses[i]] = true;
      }
    }

     // Standard Withdraw function for the owner to pull the contract
    function withdraw() external onlyOwner {
        uint256 sendAmount = address(this).balance;

        address grumpySanta = payable(0x2DFfA4DFF855A866974502D52DCc82943F63F225);

        bool success;
        (success, ) = grumpySanta.call{value: ((sendAmount * 25)/100)}("");
        require(success, "Transaction Unsuccessful");
     }

    function tokenURI(uint256 tokenId) public view override returns (string memory){
        this.ownerOf(tokenId);
        if (claimActive) {
          return string(abi.encodePacked(baseURI, toString(tokenId), ".json"));
        }

        return string(abi.encodePacked(baseURI, "prereveal.json"));
    }

    function numGiftsLeft() external view virtual returns (uint256) {
        return giftPoolTokens.length - numberClaimed;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function contractURI() external view returns (string memory) {
        return string(abi.encodePacked(baseURI, "contract.json"));
    }

    function mint(uint256 qty, address[] memory nftAddresses, uint256[] memory nftTokenIds) external payable {
        // Validate Mint
        require(mintActive, "MintInactive");
        require((qty + numberMinted) <= maxSupply, "SoldOut");
        require((qty > 0 && qty <= 10), "ValidQuty");
        require((this.balanceOf(msg.sender) + qty) <= 30, "ExceedMax");

        bool isWhitelist = whitelist[msg.sender];

        // Ok with making the whole txn free if before the cutoff
        bool isNotFreeMint = (numberFreeMints + 1 > maxFreeMints);

        uint256 price = (isNotFreeMint && !isWhitelist) ? mintPrice : 0 ether;
        require(msg.value >= qty * price, "InsufficientFunds");

        // Validate Gifts
        require(nftAddresses.length == qty && nftTokenIds.length == qty, "InvalidGift");

        // Do the Thing
        for(uint256 i = 0; i < qty; i++) {
            _addGiftToPool(numberMinted + i, msg.sender, nftAddresses[i], nftTokenIds[i]);
            _safeMint(msg.sender, numberMinted + i);
        }

        numberMinted += qty;

        if (!isNotFreeMint && !isWhitelist) {
          numberFreeMints += qty;
        }
        if(isWhitelist) {
          whitelist[msg.sender] = false;
        }
    }

    function _addGiftToPool(
      uint256 tokenId,
      address from,
      address nftAddress,
      uint256 nftTokenId
    ) internal virtual {
      // Do the Transfer. Will fail if this contract is not approved
      IERC721(nftAddress).transferFrom(from, address(this), nftTokenId);

      // Write it down
      _giftsByTID[tokenId] = Gift(
        tokenId,
        0,
        nftTokenId,
        nftAddress,
        from,
        address(0),
        address(0),
        false
      );

      giftPoolTokens.push(tokenId);
    }

    function getGiftByGifterToken(uint256 tId) external view virtual returns (Gift memory) {
        this.ownerOf(tId);
        return _giftsByTID[tId];
    }

    function getGiftByGifteeToken(uint256 tId) external view virtual returns (Gift memory) {
        require(claimActive, "Matchmaking Incomplete");
        this.ownerOf(tId);
        uint256 tIdClaim = _giftRefsToClaim[tId];
        return _giftsByTID[tIdClaim];
    }

    function claimGifts(uint256[] memory tokenIds) external {
      this.claimGifts(tokenIds, _msgSender());
    }

    function claimGifts(uint256[] memory tokenIds, address gifteeAddress) external {
      // Can Claim At All
      require(claimActive && !claimPaused, "ClaimDisabled");

      // Must Provide Tokens
      require(tokenIds.length > 0, "NoTokens");

      bool wasDelegated = tx.origin != gifteeAddress;

      // Iterate through RagingSanta token Ids
      for(uint256 i = 0; i < tokenIds.length; i++) {
        uint256 tId = tokenIds[i];

        // Does Sender own these tokens?
        require(this.ownerOf(tId) == tx.origin, "NotOwner");

        uint256 tIdClaim = _giftRefsToClaim[tId];
        Gift memory giftToClaim = _giftsByTID[tIdClaim];

        // Have these tokens been claimed yet?
        require(!giftToClaim.hasClaimed, "GiftClaimed");

        // Do the Transfer
        IERC721(giftToClaim.nftAddress).transferFrom(address(this), gifteeAddress, giftToClaim.nftTokenId);

        // Update the gift object
        _giftsByTID[tIdClaim].hasClaimed = true;
        _giftsByTID[tIdClaim].giftee = gifteeAddress;
        if (wasDelegated) {
          _giftsByTID[tIdClaim].gifteeDelegator = tx.origin;
        }
      }
      numberClaimed += tokenIds.length;
    }

    receive() external payable {}

    fallback() external payable {}
}
