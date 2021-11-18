// SPDX-License-Identifier: MIT
pragma solidity >=0.4.16 <0.9.0;

contract SecretSanta {
  address public owner;
  bool public isRegistrationOpen = true;

  mapping(address => bool) private isParticipant;
  address[] private participants;
  mapping(address => address) private giftAssignments;

  constructor() {
    owner = msg.sender;
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

    isRegistrationOpen = false;

    uint256 randomness = uint256(keccak256(abi.encodePacked(block.timestamp)));
    uint256 mLength = participants.length - 1;

    for (uint256 i = 0; i < mLength - 1; i++) {
      uint256 n = (i + randomness) % (mLength + 1);
      address temp = participants[i];
      participants[n] = participants[i];
      participants[i] = temp;
    }

    for (uint256 i = 0; i < mLength; i++) {
      giftAssignments[participants[i]] = participants[i + 1];
    }
    giftAssignments[participants[mLength]] = participants[0];
  }

  function register() public {
    require(isRegistrationOpen == true);
    require(isParticipant[msg.sender] != true);

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
