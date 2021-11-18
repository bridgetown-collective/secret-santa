const SecretSanta = artifacts.require("SecretSanta");

module.exports = function (deployer) {
  deployer.deploy(SecretSanta);
};
