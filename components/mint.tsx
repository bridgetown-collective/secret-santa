import Image from "next/image";
import Link from "next/link";
import { NFTCard } from "@bridgetown-collective/paris";

import RequireWeb3 from "./require-web3";

function Mint() {
  return (
    <div className="flex flex-wrap justify-around w-full" id="mint">
      <div className="text-center mb-8 md:mb-0">
        <p className="text-2xl alt-font">
          Santas Raging
          <br />
          {500} / 9999
          <br />
          <br />
        </p>
        <Image className="rounded-2xl" src="/assets/ShortSanta.png" height={300} width={300} />
      </div>

      <div className="flex flex-col justify-center">
        <Link href="/my-gallery">
          <button className="inline-block">Select NFT To Gift</button>
        </Link>
        <br />
        <div className="inline-block self-center">
          <NFTCard
            contractAddress="0x9048de699869385756939a7bb0a22b6d6cb63a83"
            tokenId="743"
            size={200}
          />
        </div>
        <br />
        <button disabled className="text-xl w-96 alt-font">
          Mint Now
        </button>
      </div>
    </div>
  );
}

export default function WrappedMint() {
  return RequireWeb3(<Mint />);
}
