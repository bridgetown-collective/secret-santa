import { NFTsByOwner } from "@bridgetown-collective/paris";
import { useEffect, useState } from "react";
import Web3 from "web3";

import RequireWeb3 from "../components/require-web3";

function MyGallery({ web3 }: { web3: Web3 }) {
  const [owner, setOwner] = useState<string>(null);

  useEffect(() => {
    web3.eth.getAccounts().then((accounts) => {
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
  return <RequireWeb3 Component={MyGallery} />;
}
