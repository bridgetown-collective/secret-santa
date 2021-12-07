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
    totalMinted
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
      <div className="hidden text-center flex flex-col justify-center mb-8 md:mb-0 rounded-2xl items-end mt-8">
        <Image src="/assets/ShortSanta.png" height="394" width="394" />
        <p className="text-2xl alt-font b-0 align-bottom mt-16 m-auto">
          Santas Raging
          <br />
          {totalMinted} / 9999
          <br />
          <br />
        </p>
      </div>

      <div className="flex flex-col justify-center">
        <div className="flex flex-row justify-center">
          <div className="flex align-middle text-center m-auto flex-col" style={{'width': '360px'}}>
            <h1 className="text-4xl" >0.03 ETH</h1>
          </div>
          <div className="flex align-middle text-center m-auto flex-col" style={{'width': '360px'}}>
            <h1 className="text-6xl" >+</h1>
          </div>
        {!selectedNFT?.contractAddress ? (
          <div className="flex flex-col justify-center pt-10">
            <Image
              className="cursor-pointer"
              src="/assets/gift_nft_exchange_transparent.svg"
              height="364"
              width="364"
              onClick={() => setShowNFTSelectionModal(!showNFTSelectionModal)}
            />
            <button
              className="text-xl rounded-md outline-none nice-shadow cursor-pointer mb-8 mt-10"
              onClick={() => setShowNFTSelectionModal(!showNFTSelectionModal)}
            >
              Pick an NFT To Give
            </button>
          </div>
        ) : null}
        {selectedNFT && (
          <div className="self-center">
            <RenderNFT
              className="rounded-full"
              size={371}
              nft={selectedNFT}
              onSelection={() => setShowNFTSelectionModal(true)}
            />
          </div>
        )}
        </div>
        <div className="text-center">
        {selectedNFT?.contractAddress ? (
          <button
            disabled={isMinting}
            className="text-xl w-96 alt-font rounded-md outline-none nice-shadow cursor-pointer mt-8 m-auto"
            onClick={() =>
              doMint(selectedNFT.contractAddress, selectedNFT.tokenId)
            }
          >
            Give Now
          </button>
        ) : null}
        </div>
      </div>

      {showNFTSelectionModal ? (
        <div
          className="nft-selection-modal md:p-24 overflow-auto bg-black bg-opacity-60"
          onClick={() => setShowNFTSelectionModal(false)}
        >
          <MyGallery
            size={150}
            onSelection={nft => {
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
