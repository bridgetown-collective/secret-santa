import { useEffect, useState } from "react";
import Web3 from "web3";

import contractAbi from "./contract-abi";

const CONTRACT_ADDRESSES = {
  mainnet: "0x9048de699869385756939a7bb0a22b6d6cb63a83", // @TODO: replace this LizardLab address
  testnet: "0x9d12BD80274cF93079ccBEE7D1F44664363dCfA4", // this is for rinkeby testnet
};

let web3: Web3 | null = null;

export default function useWeb3() {
  const [account, setAccount] = useState<string>(null);
  const [contract, setContract] = useState<any>(null);
  const [contractAddress, setContractAddress] = useState<string>(null);
  const [hasWeb3, setHasWeb3] = useState<boolean>(false);
  const [isClaimActive, setIsClaimActive] = useState<boolean>(false);
  const [isMintActive, setIsMintActive] = useState<boolean>(false);
  const [network, setNetwork] = useState<string>(null);
  const [totalMinted, setTotalMinted] = useState<number>(-1);

  useEffect(() => {
    if (!web3) {
      // @ts-ignore
      if (window.ethereum) {
        // @ts-ignore
        web3 = new Web3(window.ethereum);
        // @ts-ignore
      } else if (window.web3) {
        // @ts-ignore
        web3 = new Web3(window.web3.currentProvider);
      }
    }

    if (web3) {
      setHasWeb3(true);

      web3.eth.getAccounts().then((accounts: string[]) => {
        setAccount(accounts[0]);
      });

      web3.eth.net.getNetworkType().then(setNetwork);
    }
  }, []);

  useEffect(() => {
    if (!network) {
      return;
    }

    if (network === "main") {
      setContractAddress(CONTRACT_ADDRESSES.mainnet);
    } else {
      setContractAddress(CONTRACT_ADDRESSES.testnet);
    }
  }, [network]);

  useEffect(() => {
    try {
      const contract = new web3.eth.Contract(contractAbi, contractAddress);
      setContract(contract);
    } catch (e) {
      // we failed communicating with the contract here
      console.error(e);
    }
  }, [contractAddress]);

  useEffect(() => {
    if (!contract) {
      return;
    }

    try {
      contract.methods
        .mintActive()
        .call()
        .then((isActive) => {
          setIsMintActive(isActive);
        });

      contract.methods
        .claimActive()
        .call()
        .then((isActive) => {
          setIsClaimActive(isActive);
        });

      contract.methods
        .totalSupply()
        .call()
        .then((totalSupply) => {
          setTotalMinted(totalSupply);
        });
    } catch (e) {
      // we failed communicating with the contract here
    }
  }, [contract]);

  const requestConnection = async () => {
    // @TODO: hook this up for not just MetaMask

    // @ts-ignore
    if (window.ethereum) {
      // @ts-ignore
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    }
  };

  return {
    account,
    contract,
    contractAddress,
    isClaimActive,
    isMintActive,
    hasWeb3,
    network,
    requestConnection,
    totalMinted,
    web3,
  };
}
