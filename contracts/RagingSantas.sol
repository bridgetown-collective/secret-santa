pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

abstract contract Functional {
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
}

contract RagingSantas is ERC721, Ownable, Functional {
    using SafeMath for uint256;
    using Address for address;

    // Provenance hash proving random distribution
    string public provHashMint;
    string public provHashMatch;
    string public baseURI;

    uint256 public matchSeed;
    uint256 public mintPrice;

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
      mintPrice = 0.03 ether;
      maxFreeMints = freeMintsSupply;
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

    function setBaseURI(string memory newURI) external onlyOwner {
        baseURI = newURI;
    }

    function setProvHashMint(string memory newHash) external onlyOwner {
        provHashMint = newHash;
    }
    
    function setProvHashMatch(string memory newHash) external onlyOwner {
        provHashMatch = newHash;
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
        require(mintActive, "Minting Inactive");
        require((qty + numberMinted) <= maxSupply, "Mint Sold Out");
        require((qty > 0 && qty <= 10), "Valid Quantity");
        require((this.balanceOf(_msgSender()) + qty) <= 30, "Exceed Max Per Wallet");

        // TODO: check WL

        // Ok with making the whole txn free if before the cutoff
        bool isNotFreeMint = (numberFreeMints + 1 > maxFreeMints);
        uint256 price = isNotFreeMint ? mintPrice : 0 ether;
        require(msg.value >= qty * price, "Insufficient Funds");

        // Validate Gifts
        require(nftAddresses.length == qty, "Invalid gift");
        require(nftTokenIds.length == qty, "Invalid gift");

        uint256 firstMintTokenId = numberMinted;

        // Do the Thing
        for(uint256 i = 0; i < qty; i++) {
            _addGiftToPool(firstMintTokenId + i, _msgSender(), nftAddresses[i], nftTokenIds[i]);
            _safeMint(_msgSender(), firstMintTokenId + i);
        }

        numberMinted += qty;

        if (!isNotFreeMint) {
          numberFreeMints += qty;
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
      require(claimActive && !claimPaused, "Claiming Disabled");

      // Must Provide Tokens
      require(tokenIds.length > 0, "No Tokens");

      bool wasDelegated = tx.origin != gifteeAddress;

      // Iterate through RagingSanta token Ids
      for(uint256 i = 0; i < tokenIds.length; i++) {
        uint256 tId = tokenIds[i];

        // Does Sender own these tokens?
        require(this.ownerOf(tId) == tx.origin, "Not Owner");

        uint256 tIdClaim = _giftRefsToClaim[tId];
        Gift memory giftToClaim = _giftsByTID[tIdClaim];

        // Have these tokens been claimed yet?
        require(!giftToClaim.hasClaimed, "Gift Claimed");

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
