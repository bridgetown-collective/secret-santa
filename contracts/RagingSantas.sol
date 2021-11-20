pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract RagingSantas is ERC721, Ownable {
    uint256[] public tokens;
    uint256 private constant maxSupply = 4096;

    constructor(string memory name, string memory symbol)
        ERC721(name, symbol)
    {
       console.log("name", name);
       console.log("symbol", symbol);
       console.log("msg.sender", msg.sender); //msg.sender is the address that initially deploys a contract
    }

    function mint(address to) external {
        uint256 newId = tokens.length;
        tokens.push(1);
        _safeMint(to, newId);
    }
}
