import Image from "next/image";

import useWeb3 from "../lib/use-web3";
import MyGallery, { RenderNFT } from "../pages/my-gallery";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Mint() {
  const {
    account,
    contract,
    hasWeb3,
    isMintActive,
    requestConnection,
    totalMinted,
  } = useWeb3();
  const [isMinting, setIsMinting] = useState<boolean>(false);
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

  if (!isMintActive) {
    return <p className="text-3xl">Patience - the mint isn't active yet</p>;
  }

  const doMint = async (contractAddress: string, tokenId: string) => {
    setIsMinting(true);

    try {
      // @TODO: check these params
      await contract.methods.mint(1, [contractAddress], [tokenId]).call();

      setIsMinting(false);
      toast.success("Success!");
      // @TODO: do something post mint - i.e. redirect to gift share page
    } catch (e) {
      console.error(e);
      toast.error(e.message);
    }
  };

  return (
    <div className="flex flex-wrap justify-around w-full" id="mint">
      <div className="text-center mb-8 md:mb-0">
        <p className="text-2xl alt-font">
          Santas Raging
          <br />
          {totalMinted} / 9999
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
        {!selectedNFT?.contractAddress ? (
          <button
            className="inline-block text-xl rounded-md outline-none nice-shadow cursor-pointer mb-8"
            onClick={() => setShowNFTSelectionModal(!showNFTSelectionModal)}
          >
            Select NFT To Gift
          </button>
        ) : null}
        {selectedNFT && (
          <div className="self-center">
            <RenderNFT
              nft={selectedNFT}
              onSelection={() => setShowNFTSelectionModal(true)}
            />
          </div>
        )}
        {selectedNFT?.contractAddress ? (
          <button
            disabled={isMinting}
            className="text-xl w-96 alt-font rounded-md outline-none nice-shadow cursor-pointer mt-8"
            onClick={() =>
              doMint(selectedNFT.contractAddress, selectedNFT.tokenId)
            }
          >
            Mint Now
          </button>
        ) : null}
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
