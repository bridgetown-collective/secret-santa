// SPDX-License-Identifier: MIT
pragma solidity >=0.4.16 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "hardhat/console.sol";

contract SecretSanta is ERC721Holder {
  address public owner;
  bool public isRegistrationOpen = true;

  mapping(address => bool) private isParticipant;
  address[] private participants;
  mapping(address => address) private giftAssignments;
  mapping(address => uint256) private participantSeed;

  constructor() {
    owner = msg.sender;
    // console.log('O hai - Constructed');
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  function openRegistration() public onlyOwner {
    require(isRegistrationOpen == false);
    // @TODO: require 0 gifts to have been transferred before re-opening

    isRegistrationOpen = true;
  }

  function closeRegistration() public onlyOwner {
    require(isRegistrationOpen == true);
    require(participants.length > 1);

    // console.log('Closing Registration');

    isRegistrationOpen = false;

    uint256 mLength = participants.length;


    for (uint256 i = 0; i < mLength - 1; i++) {
      address participantAddr = participants[i];
      uint256 n = i + (participantSeed[participantAddr] % (mLength - i));

      // console.log('Swapping participants', i, 'and', n);

      participants[i] = participants[n];
      participants[n] = participantAddr;
    }

    for (uint256 i = 0; i < mLength - 1; i++) {
      giftAssignments[participants[i]] = participants[i + 1];
      // console.log('Gifter:', participants[i], ' for Giftee:', participants[i+1]);
    }
    giftAssignments[participants[mLength-1]] = participants[0];

  }

  function register() public {
    require(isRegistrationOpen == true);
    require(isParticipant[msg.sender] != true);

    participantSeed[msg.sender] = uint256(
      keccak256(
        abi.encodePacked(block.timestamp, msg.sender, participants.length)
      )
    );
    isParticipant[msg.sender] = true;
    participants.push(msg.sender);
  }

  function deregister() public {
    require(isRegistrationOpen == true);
    require(isParticipant[msg.sender] == true);

    isParticipant[msg.sender] = false;

    for (uint256 i = 0; i < participants.length; i++) {
      if (participants[i] == msg.sender) {
        delete participants[i];
        break;
      }
    }
  }

  function getParticipantCount() public view returns (uint256) {
    return participants.length;
  }

  function getAssignedGiftee() public view returns (address) {
    require(isRegistrationOpen == false);
    require(isParticipant[msg.sender] == true);

    return giftAssignments[msg.sender];
  }
}
