import "styled-jsx";
import { useEffect, useState } from "react";

import { RenderNFT } from "../pages/my-gallery";
import { useNFTQuery } from "@bridgetown-collective/paris";

import { Gift } from "./claim";
import useWeb3 from "../lib/use-web3";

const NFTWrapper = ({ contractAddress, tokenId, size }) => {
  const { nft } = useNFTQuery(contractAddress, tokenId);
  return (
    <div className="render-nft">
      <RenderNFT size={size} nft={nft} />
    </div>
  );
};

interface GiftWrapperProps {
  gifteeTokenId?: number;
  gifterTokenId?: number;
  gift?: Gift;
}

export default function GiftWrapper({
  gifteeTokenId,
  gifterTokenId,
  gift
}: GiftWrapperProps) {
  let inputs = [gifteeTokenId, gifterTokenId, gift];
  inputs = inputs.filter(x => x != null);
  console.log('inputs', inputs);
  if (inputs.length != 1) {
    throw "Must define exactly one of gifteeTokenId, gifterTokenId, gift";
  }

  const { account, contract, contractAddress } = useWeb3();

  const [giftToRender, setGiftToRender] = useState<Gift>(null);

  useEffect(() => {
    if (!account || !contract || !contractAddress) {
      return;
    }

    if (!gift) {
      const tokenId = gifteeTokenId != null ? gifteeTokenId : gifterTokenId;
      let getGiftFn = contract.methods.getGiftByGifterToken;
      if (gifteeTokenId != null) {
        getGiftFn = contract.methods.getGiftByGifteeToken;
      }

      // Null check to handle tokenId=0 case
      gift = getGiftFn(tokenId)
        .call()
        .catch(() => null);
    }
    setGiftToRender(gift);
  }, [gifteeTokenId, gifterTokenId, account, contract]);

  const isGiftToOpen = giftToRender && !giftToRender.hasClaimed
  const isGiftPast = giftToRender && giftToRender.hasClaimed
  const cn = isGiftToOpen ? 'gift-to-claim' : 'gift-past';

  return (
    <div>
      {giftToRender && (
        <div className={`gift-card mx-12 overflow-hidden ${cn}`}>
          {isGiftToOpen && (
            <>
              <img
                className="cursor-pointer box-closed"
                src="/assets/gift_NFT_box_closed.svg"
                height="300"
                width="300"
              />
              <div>for RagingSanta #{giftToRender.gifteeTokenId}</div>
            </>
          )}
          {isGiftPast && (
            <div className="flex flex-col justify-center relative">
              <img
                className="box-opened-bg"
                src="/assets/gift_NFT_box_opened.svg"
                height="450"
                width="450"
              />
              <div className="m-auto mb-28">
                <NFTWrapper
                  contractAddress={giftToRender.nftAddress}
                  tokenId={giftToRender.nftTokenId}
                  size={228}
                />
              </div>
              <div className="w-full">
              {giftToRender.nftAddress} #{giftToRender.nftTokenId} askdjf;laksjdf;klajsdf;klaj sd;flk j
              </div>
            </div>
          )}
        </div>
      )}
      <style jsx global>{`
        .box-opened-bg {
          position: absolute;
          top: 153px;
          left: 0;
        }

        .gift-card {
          display: flex-inline;
          margin: 1.5rem 0.5rem;
          padding: 1rem 1rem;
          background: url("/assets/cardboard.png");
          background-color: #7f3c10;
          border-radius: 1em;
          color: #ffa;
          box-shadow: var(--shadow-elevation-high-red);
          width: 247px;
        }

        .gift-card.gift-to-claim img.box-closed {
          width: 215px;
        }

        .gift-card.gift-past {
          width: 300px;
        }

        .gift-card.gift-past .image-container {
          text-align: center;
        }

        .gift-card.gift-past .image-container > span {
          width: 151px !important;
          margin: auto !important;
        }

        @media (min-width: 1024px) {
          .gift-card {
            width: 311px;
            margin: 2rem;
          }
          .gift-card.gift-to-claim img.box-closed {
            width: 280px;
          }
          .render-nft img {
            width: 280px !important;
          }
          .gift-card.gift-past {
            width: 340px;
          }
          .gift-card.gift-past .image-container > span {
            width: 200px !important;
            margin: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
