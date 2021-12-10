import "styled-jsx";
import Image from "next/image";
import { useEffect, useState } from "react";

import { RenderNFT } from "../pages/my-gallery";
import { useNFTQuery } from "@bridgetown-collective/paris";

import { Gift } from "./claim";
import useWeb3 from "../lib/use-web3";

const NFTWrapper = ({ contractAddress, tokenId }) => {
  const { nft } = useNFTQuery(contractAddress, tokenId);
  return (
    <div className="render-nft">
      <RenderNFT size={240} nft={nft} />
    </div>
  );
};

export default function GiftWrapper({ gifteeTokenId, gifterTokenId }) {
  if (!((gifteeTokenId != null) ^ (gifterTokenId != null))) {
    throw "Please define either gifteeTokenId or gifterTokenId but not both";
  }

  const {
    account,
    contract,
    contractAddress,
    hasWeb3,
    isClaimActive,
    network,
    requestConnection,
    web3
  } = useWeb3();

  const [giftToRender, setGiftToRender] = useState<Gift>(null);
  const [isLoading, setisLoading] = useState<bool>(true);
  const [nft, setNft] = useState<any>(null);

  useEffect(async () => {
    if (!account || !contract || !contractAddress) {
      return;
    }

    const tokenId = gifteeTokenId != null ? gifteeTokenId : gifterTokenId;
    let getGiftFn = contract.methods.getGiftByGifterToken;
    if (gifteeTokenId != null) {
      getGiftFn = contract.methods.getGiftByGifteeToken;
    }

    // Null check to handle tokenId=0 case
    let gift = await getGiftFn(tokenId)
      .call()
      .catch(() => null);
    setGiftToRender(gift);
  }, [gifteeTokenId, gifterTokenId, account, contract]);

  return (
    <div>
      {giftToRender && (
        <div className="gift-card mx-12">
          {giftToRender && !giftToRender.hasClaimed && (
            <>
              <Image
                className="cursor-pointer"
                src="/assets/gift_NFT_box_closed.svg"
                height="364"
                width="364"
              />
              <div>for RagingSanta #{giftToRender.gifteeTokenId}</div>
            </>
          )}
          {giftToRender && giftToRender.hasClaimed && (
            <div className="flex flex-col justify-center relative">
              <img
                className="box-opened-bg"
                src="/assets/gift_NFT_box_opened.svg"
                height="400"
                width="400"
              />
              <div className="m-auto mb-36">
                <NFTWrapper
                  contractAddress={giftToRender.nftAddress}
                  tokenId={giftToRender.nftTokenId}
                />
              </div>
              {giftToRender.nftAddress} #{giftToRender.nftTokenId}
            </div>
          )}
        </div>
      )}
      <style jsx>{`
        .box-opened-bg {
          position: absolute;
          top: 180px;
          left: 0;
        }
        .gift-card {
          display: flex-inline;
          margin: 2rem;
          padding: 1rem 1rem;
          background: url("/assets/cardboard.png");
          background-color: #7f3c10;
          border-radius: 1em;
          color: #ffa;
          box-shadow: var(--shadow-elevation-high-red);
        }

        .render-nft img {
          box-shadow: var(--shadow-elevation-high-brown);
        }

      `}</style>
    </div>
  );
}
