import { useNFTsByOwnerQuery } from "@bridgetown-collective/paris";
import { useEffect, useState } from "react";
import Image from "next/image";
import "styled-jsx";

import useWeb3 from "../lib/use-web3";

const PLACEHOLDER_IMAGE = "/assets/hi-res-logo.png";

export function RenderNFT({
  nft,
  onSelection,
  size = 300
}: {
  nft;
  onSelection?;
  size?: number;
}): JSX.Element {
  const [finalImage, setFinalImage] = useState<string>(nft?.metadata?.image);

  useEffect(() => {
    if (nft?.metadata?.image) {
      setFinalImage(nft?.metadata?.image);
    }
  }, [nft]);

  useEffect(() => {
    if (!finalImage) {
      setFinalImage(PLACEHOLDER_IMAGE);
    }
  }, [finalImage]);

  if (!finalImage) {
    return null;
  }

  return (
    <div
      className={`nft-card m-4 ${onSelection ? "cursor-pointer" : ""}`}
      onClick={() => (onSelection ? onSelection(nft) : null)}
    >
      <div className="image-container">
        <Image
          src={finalImage}
          layout="fill"
          objectFit="contain"
          placeholder="blur"
          blurDataURL={PLACEHOLDER_IMAGE}
          onError={() => setFinalImage(PLACEHOLDER_IMAGE)}
        />
      </div>
      <p className="text-md text-center pt-1">{nft?.metadata?.name}</p>

      <style jsx>{`
        .nft-card {
          width: ${size}px;
        }

        .nft-card p {
          color: #ffa;
        }

        .image-container {
          height: ${size}px;
          position: relative;
          width: ${size}px;
          border-radius: 99px;
        }
      `}</style>
    </div>
  );
}

export function OwnerGallery({
  owner,
  ...props
}: {
  owner: string;
}): JSX.Element {
  const nfts = useNFTsByOwnerQuery(owner);

  if (!owner) {
    return null;
  }

  if (nfts.length == 0) {
    return (
      <div className="flex flex-col justify-center align-middle w-full h-full text-white text-center">
        <h1 className="text-7xl" style={{ color: "var(--color-yellow)" }}>
          No NFTs (ERC-721) detected in this wallet
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center align-center owner-gallery">
      {nfts.map(nft => (
        <RenderNFT
          key={`${nft.contractAddress}/${nft.tokenId}`}
          nft={nft}
          {...props}
        />
      ))}
    </div>
  );
}

export default function WrappedMyGallery(props) {
  const { account, hasWeb3 } = useWeb3();

  if (!hasWeb3 || !account) {
    return null;
  }

  return <OwnerGallery owner={account} {...props} />;
}
