import { NFTsByOwner } from "@bridgetown-collective/paris";

// @TODO: set post deployment - maybe as envvar?
const CONTRACT_ADDRESS = "";

export default function GiftPool() {
  if (!CONTRACT_ADDRESS) {
    return <p className="text-4xl">No contract defined</p>;
  }

  return <NFTsByOwner address={CONTRACT_ADDRESS} />;
}
