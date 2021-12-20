// SPDX-License-Identifier: UNLICENSED
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

    uint256 public constant mintPrice = 0.03 ether;

    uint256 public maxSupply;
    uint256 public numberMinted;
    uint256 public numberClaimed;
    uint256 public freeMintsLeft;

    struct Gift {
        uint256 gifteeTokenId;
        uint256 gifterTokenId;
        uint256 nftTokenId;
        address nftAddress;
        address gifter;
        address giftee;
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

    //there is a lot to unpack here
    constructor(uint256 supply, uint256 freeMintsSupply)
        ERC721("Raging Santas", "RAGIN")
    {
        mintActive = false;
        claimActive = false;
        maxSupply = supply;
        freeMintsLeft = freeMintsSupply;
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

        claimActive = true;

        if (mintActive == false) {
            // don't reshuffle if mint wasn't active
            return;
        }

        mintActive = false;

        // Do the first element
        uint256 totalGifts = giftPoolTokens.length;
        uint256 n = uint256(keccak256(abi.encodePacked(seed))) % totalGifts;
        uint256 lastTokenId = giftPoolTokens[n];
        uint256 thisTokenId;

        (giftPoolTokens[0], giftPoolTokens[n]) = (
            lastTokenId,
            giftPoolTokens[0]
        );

        uint256 mLen = totalGifts.sub(1);
        // Fisher Yates Shuffle
        for (uint256 i = 1; i < mLen; i++) {
            n = i + uint256(keccak256(abi.encodePacked(i + seed))) %
                (totalGifts - i);
            thisTokenId = giftPoolTokens[n];
            (giftPoolTokens[i], giftPoolTokens[n]) = (
                thisTokenId,
                giftPoolTokens[i]
            );
            _giftsByTID[lastTokenId].gifteeTokenId = thisTokenId;
            _giftRefsToClaim[thisTokenId] = lastTokenId;
            lastTokenId = thisTokenId;
        }

        _giftsByTID[giftPoolTokens[mLen-1]].gifteeTokenId = giftPoolTokens[mLen];
        _giftRefsToClaim[giftPoolTokens[mLen]] = giftPoolTokens[mLen-1];
        _giftsByTID[giftPoolTokens[mLen]].gifteeTokenId = giftPoolTokens[0];
        _giftRefsToClaim[giftPoolTokens[0]] = giftPoolTokens[mLen];
    }

    
    // Standard Withdraw function for the owner to pull the contract
    function withdraw() external onlyOwner {
        uint256 sendAmount = address(this).balance;

        bool success;
        (success, ) = msg.sender.call{value: sendAmount}("");
        require(success, "X");
    }

    function pauseClaim() external onlyOwner {
        claimActive = false;
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

    function setFreeMintsLeft(uint256 _freeMintsLeft) external onlyOwner {
        freeMintsLeft = _freeMintsLeft;
    }

    function addWhitelist(address[] calldata addresses) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            whitelist[addresses[i]] = true;
        }
    }

    // Should only be run before claiming begins
    function rescueGift(uint256 tokenId, address sendTo) external onlyOwner {
        Gift memory giftToPull = _giftsByTID[tokenId];
        IERC721(giftToPull.nftAddress).transferFrom(
            address(this),
            sendTo,
            giftToPull.nftTokenId
        );
        _giftsByTID[tokenId].hasClaimed = true;
        _giftsByTID[tokenId].giftee = sendTo;

        // eliminate gift from pool if claim hasnt started yet
        if (!claimActive) {
            (
                giftPoolTokens[tokenId],
                giftPoolTokens[giftPoolTokens.length - 1]
            ) = (
                giftPoolTokens[giftPoolTokens.length - 1],
                giftPoolTokens[tokenId]
            );
            giftPoolTokens.pop();
        }
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        this.ownerOf(tokenId);
        return string(abi.encodePacked(baseURI, toString(tokenId), ".json"));
    }

    function numGiftsLeft() external view virtual returns (uint256) {
        return giftPoolTokens.length - numberClaimed;
    }

    function mint(address nftAddress, uint256 nftTokenId) external payable {
        // Validate Mint
        require(mintActive, "MintInactive");
        require((1 + numberMinted) <= maxSupply, "SoldOut");
        require((this.balanceOf(msg.sender) + 1) <= 30, "ExceedMax");
        require(nftAddress != address(this), "CantRegift");

        bool isWhitelist = whitelist[msg.sender];

        // Ok with making the whole txn free if before the cutoff
        bool isNotFreeMint = (freeMintsLeft == 0);

        uint256 price = (isNotFreeMint && !isWhitelist) ? mintPrice : 0 ether;
        require(msg.value >= 1 * price, "InsufficientFunds");

        // Do the Thing
        _addGiftToPool(numberMinted, msg.sender, nftAddress, nftTokenId);
        _safeMint(msg.sender, numberMinted);

        numberMinted = numberMinted.add(1);

        if (!isNotFreeMint && !isWhitelist) {
            freeMintsLeft = (freeMintsLeft > 1) ? freeMintsLeft.sub(1) : 0;
        }
        if (isWhitelist) {
            whitelist[msg.sender] = false;
        }
    }

    function _addGiftToPool(
        uint256 tokenId,
        address from,
        address nftAddress,
        uint256 nftTokenId
    ) internal virtual {
        // Write it down
        _giftsByTID[tokenId] = Gift(
            0,
            tokenId,
            nftTokenId,
            nftAddress,
            from,
            address(0),
            false
        );

        giftPoolTokens.push(tokenId);

        // Do the Transfer. Will fail if this contract is not approved
        IERC721(nftAddress).transferFrom(from, address(this), nftTokenId);

    }

    function getGiftByGifterToken(uint256 tId)
        external
        view
        virtual
        returns (Gift memory)
    {
        this.ownerOf(tId);
        return _giftsByTID[tId];
    }

    function getGiftByGifteeToken(uint256 tId)
        external
        view
        virtual
        returns (Gift memory)
    {
        require(claimActive, "Matchmaking Incomplete");
        this.ownerOf(tId);
        uint256 tIdClaim = _giftRefsToClaim[tId];
        return _giftsByTID[tIdClaim];
    }

    function claimGifts(uint256[] memory tokenIds) external {
        // Can Claim At All
        require(claimActive, "ClaimDisabled");

        // Must Provide Tokens
        require(tokenIds.length > 0, "NoTokens");

        // Iterate through RagingSanta token Ids
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tId = tokenIds[i];

            // Does Sender own these tokens?
            require(this.ownerOf(tId) == msg.sender, "NotOwner");

            uint256 tIdClaim = _giftRefsToClaim[tId];
            Gift memory giftToClaim = _giftsByTID[tIdClaim];

            // Have these tokens been claimed yet?
            require(!giftToClaim.hasClaimed, "GiftClaimed");

            // Update the gift object
            _giftsByTID[tIdClaim].hasClaimed = true;
            _giftsByTID[tIdClaim].giftee = msg.sender;

            // Do the Transfer
            IERC721(giftToClaim.nftAddress).transferFrom(
                address(this),
                msg.sender,
                giftToClaim.nftTokenId
            );
        }
        numberClaimed = numberClaimed.add(tokenIds.length);
    }

    receive() external payable {}

    fallback() external payable {}
}
