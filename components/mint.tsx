import Image from "next/image";
import Web3 from "web3";

import useWeb3 from "../lib/use-web3";
import MyGallery, { RenderNFT } from "../pages/my-gallery";
import { useState } from "react";
import { toast } from "react-toastify";
import contractAbi from "../lib/contract-abi";

export default function Mint() {
  const {
    account,
    contract,
    contractAddress: ragingSantasContractAddress,
    hasWeb3,
    freeMintsLeft,
    isClaimActive,
    isMintActive,
    requestConnection,
    totalMinted,
    web3,
  } = useWeb3();
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [showNFTSelectionModal, setShowNFTSelectionModal] = useState(false);
  const [mintingMessage, setMintingMessage] = useState(null);

  if (!hasWeb3 || !account) {
    return (
      <button
        className="text-xl rounded-md outline-none nice-shadow"
        onClick={requestConnection}
      >
        Connect To Mint
      </button>
    );
  }

  if (!isMintActive) {
    if (!isClaimActive) {
      return <p className="text-3xl">Patience - the mint isn't active yet</p>;
    }

    return <p className="text-3xl">Santa's on his way</p>;
  }

  const doMint = async (contractAddress: string, tokenId: string) => {
    setIsMinting(true);

    try {
      const selectedTokenContract = await new web3.eth.Contract(
        contractAbi,
        contractAddress
      );

      setMintingMessage("Wrapping your gift...");

      await selectedTokenContract.methods
        .approve(ragingSantasContractAddress, tokenId)
        .send({ from: account });

      setMintingMessage("Sending it to Santa...");

      const price = Boolean(freeMintsLeft) ? "0" : "0.03";

      await contract.methods
        .mint(contractAddress, tokenId)
        .send({ from: account, value: Web3.utils.toWei(price, "ether") });

      setIsMinting(false);
      setMintingMessage("Santa thanks you!");
      setSelectedNFT(null);
      toast.success("Success!");

      // @TODO: do something post mint - i.e. redirect to gift share page
    } catch (e) {
      console.error(e);
      toast.error(e.message);
      setIsMinting(false);
      setMintingMessage(null);
    }
  };

  return (
    <div>
      <a className="anchor" id="mint"></a>
      <div className="flex flex-wrap justify-around w-full">
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
          <div>
            <h1
              className="text-center text-3xl mb-5 underline text-shadow"
              style={{ color: "var(--color-green" }}
            >
              Give
            </h1>
          </div>
          <div className="flex flex-col lg:flex-row justify-center">
            <div className="flex flex-col text-center">
              <Image src="/assets/eth_box.png" height="364" width="364" />
              <h1 className="text-4xl lg:pt-12 iniya-header">
                {!!freeMintsLeft
                  ? `${freeMintsLeft} Free Mint${
                      freeMintsLeft > 1 ? "s" : ""
                    } Left!`
                  : "0.03 ETH"}
              </h1>
            </div>
            <div className="flex align-middle text-center m-auto h-36 lg:h-auto flex-col">
              <h1 className="text-9xl font-black color-pink mt-0 mx-8 mb-40">
                +
              </h1>
            </div>
            {!selectedNFT?.contractAddress ? (
              <div className="flex flex-col justify-center">
                <Image
                  className="cursor-pointer"
                  src="/assets/gift_NFT_box_closed.png"
                  height="364"
                  width="364"
                  onClick={() =>
                    setShowNFTSelectionModal(!showNFTSelectionModal)
                  }
                />
                <button
                  className="text-xl rounded-md outline-none nice-shadow cursor-pointer mb-8 lg:mt-10"
                  onClick={() =>
                    setShowNFTSelectionModal(!showNFTSelectionModal)
                  }
                >
                  Select NFT To Give
                </button>
              </div>
            ) : null}
            {selectedNFT && (
              <div className="self-center">
                <RenderNFT
                  size={371}
                  nft={selectedNFT}
                  onSelection={() => setShowNFTSelectionModal(true)}
                />
              </div>
            )}
          </div>
          <div className="text-center">
            {selectedNFT?.contractAddress ? (
              <>
                <button
                  disabled={isMinting}
                  className="text-xl w-96 rounded-md outline-none nice-shadow cursor-pointer mt-8 m-auto"
                  onClick={() =>
                    doMint(selectedNFT.contractAddress, selectedNFT.tokenId)
                  }
                >
                  {mintingMessage
                    ? mintingMessage
                    : "Wrap This Gift For 0.03 ETH"}
                </button>
                <p className="mt-1">
                  Make sure it's a good one!
                  <br />
                  You don't want coal for Christmas, <i>do you</i>?
                </p>
              </>
            ) : null}
          </div>
        </div>
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
