// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract RagingSantas is ERC721, Ownable {
    using SafeMath for uint256;
    using Address for address;

    // Provenance hash proving random distribution
    string public provHashMint;
    string public baseURI;

    uint256 public constant mintPrice = 0.03 ether;

    uint256 public maxSupply;
    uint256 public numberMinted;
    uint256 public freeMintsLeft;

    // Mapping address for whitelist membership (gets free mint)
    mapping(address => bool) public whitelist;

    bool public mintActive;

    // there is a lot to unpack here
    constructor(uint256 supply, uint256 freeMintsSupply)
        ERC721("Raging Santas", "RAGIN")
    {
        mintActive = false;
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

    // Standard Withdraw function for the owner to pull the contract
    function withdraw() external onlyOwner {
        uint256 sendAmount = address(this).balance;

        bool success;
        (success, ) = msg.sender.call{value: sendAmount}("");
        require(success, "X");
    }

    function setBaseURI(string calldata newURI) external onlyOwner {
        baseURI = newURI;
    }

    function setProvHashMint(string calldata newHash) external onlyOwner {
        provHashMint = newHash;
    }

    function setFreeMintsLeft(uint256 _freeMintsLeft) external onlyOwner {
        freeMintsLeft = _freeMintsLeft;
    }

    function addWhitelist(address[] calldata addresses) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            whitelist[addresses[i]] = true;
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

    function mint(uint256 quantity) external payable {
        // Validate Mint
        require(mintActive, "MintInactive");
        require((quantity + numberMinted) <= maxSupply, "SoldOut");
        require((this.balanceOf(msg.sender) + quantity) <= 30, "ExceedMax");

        bool isWhitelist = whitelist[msg.sender];

        // Ok with making the whole txn free if before the cutoff
        bool isNotFreeMint = (freeMintsLeft == 0);

        uint256 price = (isNotFreeMint && !isWhitelist) ? mintPrice : 0 ether;
        require(msg.value >= quantity * price, "InsufficientFunds");

        // Do the Thing
        for (uint256 i = 0; i < quantity; i += 1) {
            _safeMint(msg.sender, numberMinted + i);
        }
        numberMinted = numberMinted.add(quantity);

        if (!isNotFreeMint && !isWhitelist) {
            freeMintsLeft = (freeMintsLeft > quantity)
                ? freeMintsLeft.sub(quantity)
                : 0;
        }
        if (isWhitelist) {
            whitelist[msg.sender] = false;
        }
    }

    receive() external payable {}

    fallback() external payable {}
}
