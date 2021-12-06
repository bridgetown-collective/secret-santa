import { NFTsByOwner } from "@bridgetown-collective/paris";
import { useEffect, useState } from "react";

import RequireWeb3 from "../components/require-web3";

function MyGallery() {
  const [owner, setOwner] = useState<string>(null);

  useEffect(() => {
    // @ts-ignore
    const { ethereum } = window;
    ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
      setOwner(accounts[0]?.toLowerCase());
    });
  }, []);

  if (!owner) {
    return null;
  }

  return (
    <div className="flex flex-col justify-center align-center">
      <p className="text-4xl">My Gallery</p>
      <NFTsByOwner owner={owner} />
    </div>
  );
}

export default function WrappedMyGallery() {
  return RequireWeb3(<MyGallery />);
}
