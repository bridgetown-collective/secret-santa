import Image from "next/image";

import useWeb3 from "./use-web3";
import MyGallery, { RenderNFT } from "../pages/my-gallery";
import { useState } from "react";

export default function Mint() {
  const { account, hasWeb3, requestConnection } = useWeb3();
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [showNFTSelectionModal, setShowNFTSelectionModal] = useState(false);

  if (!hasWeb3 || !account) {
    return (
      <button
        className="text-xl rounded-md outline-none nice-shadow"
        onClick={requestConnection}
      >
        Login To Mint
      </button>
    );
  }

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
        <Image
          className="rounded-2xl"
          src="/assets/ShortSanta.png"
          height={300}
          width={300}
        />
      </div>

      <div className="flex flex-col justify-center">
        <button
          className="inline-block rounded-md outline-none nice-shadow"
          onClick={() => setShowNFTSelectionModal(!showNFTSelectionModal)}
        >
          Select NFT To Gift
        </button>
        <br />
        {selectedNFT && (
          <RenderNFT
            nft={selectedNFT}
            onSelection={() => setShowNFTSelectionModal(true)}
          />
        )}
        <br />
        <button
          disabled
          className="text-xl w-96 alt-font rounded-md outline-none nice-shadow"
        >
          Mint Now
        </button>
      </div>

      {showNFTSelectionModal ? (
        <div
          className="nft-selection-modal md:p-24 overflow-auto bg-black bg-opacity-60"
          onClick={() => setShowNFTSelectionModal(false)}
        >
          <MyGallery
            size={150}
            onSelection={(nft) => {
              setSelectedNFT(nft);
              setShowNFTSelectionModal(false);
            }}
          />
        </div>
      ) : null}

      <style jsx>{`
        .nft-selection-modal {
          bottom: 0;
          left: 0;
          position: fixed;
          right: 0;
          top: 0;
          z-index: 99;
        }
      `}</style>
    </div>
  );
}
