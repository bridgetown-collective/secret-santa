import { useEffect, useState } from "react";
import Web3 from "web3";

export default function useWeb3() {
  const [hasWeb3, setHasWeb3] = useState<Boolean>(false);
  const [account, setAccount] = useState<string>(null);

  useEffect(() => {
    let web3: any;

    // @ts-ignore
    if (window.ethereum) {
      // @ts-ignore
      web3 = new Web3(window.ethereum);
      // @ts-ignore
    } else if (window.web3) {
      // @ts-ignore
      web3 = new Web3(window.web3.currentProvider);
    }

    if (web3) {
      setHasWeb3(true);
    }

    web3.eth.getAccounts().then((accounts: string[]) => {
      setAccount(accounts[0]);
    });
  }, []);

  const requestConnection = async () => {
    // @TODO: hook this up for not just MetaMask

    // @ts-ignore
    if (window.ethereum) {
      // @ts-ignore
      const accounts = await window.ethereum.enable();
      setAccount(accounts[0]);
    }
  };

  return { account, hasWeb3, requestConnection };
}
