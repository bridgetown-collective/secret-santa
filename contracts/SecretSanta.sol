pragma solidity >=0.4.16 <0.9.0;

contract SecretSanta {
  address public owner;
  bool public isRegistrationOpen = true;

  mapping(address => bool) private participants;
  address[] private giftChain;

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
    isRegistrationOpen = false;
  }

  function register() public {
    require(isRegistrationOpen == true);
    require(participants[msg.sender] != true);

    participants[msg.sender] = true;

    // @TODO: randomize this insertion
    giftChain.push(msg.sender);
  }

  function deregister() public {
    require(isRegistrationOpen == true);
    require(participants[msg.sender] == true);

    participants[msg.sender] = false;

    // @TODO: remove from giftChain
  }

  function getParticipantCount() public view returns (uint256) {
    return giftChain.length;
  }

  function getAssignedGiftee() public view returns (address) {
    require(isRegistrationOpen == false);
    require(participants[msg.sender] == true);

    for (uint256 i = 0; i < giftChain.length; i++) {
      if (giftChain[i] == msg.sender) {
        if (i < giftChain.length - 1) {
          return giftChain[i + 1];
        }

        return giftChain[0];
      }
    }

    // @TODO: work out corner cases - this shouldn't be possible though
    return msg.sender;
  }
}
