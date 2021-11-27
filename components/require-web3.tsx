import { useEffect, useState } from "react";
import Web3 from "web3";

export default function RequireWeb3({
  Component,
  children,
  shouldRenderAction = true,
}: {
  Component?: (props: Record<string, unknown>) => JSX.Element;
  children?: JSX.Element | JSX.Element[];
  shouldRenderAction?: boolean;
}) {
  const [web3, setWeb3] = useState<Web3>(null);

  const requestConnection = async () => {
    // @ts-ignore next-block
    if (window.ethereum) {
      // @ts-ignore
      await window.ethereum.request({ method: "eth_requestAccounts" });
      // @ts-ignore
      window.web3 = new Web3(window.ethereum);
      // @ts-ignore
      setWeb3(window.web3);
    }
  };

  useEffect(() => {
    // @TODO: fix tsconfig
    // @ts-ignore
    if (window.web3 && window.web3.eth) {
      // @ts-ignore
      setWeb3(window.web3);
    }
  }, []);

  if (!web3) {
    if (!shouldRenderAction) {
      return null;
    }

    return <button onClick={() => requestConnection()}>Login</button>;
  }

  if (Component) {
    return <Component web3={web3} />;
  }

  return <div>{children}</div>;
}
