import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { RenderNFT } from "../pages/my-gallery";
import contractAbi from "../lib/contract-abi";
import useWeb3 from "../lib/use-web3";

interface Gift {
  gifterTokenId: number;
  gifteeTokenId: number;
  nftTokenId: number;
  nftAddress: string;
  gifter: string;
  giftee: string;
  gifteeDelegator: string;
  hasClaimed: boolean;
}

interface GiftGroups {
  giftsOwned: Gift[];
  giftsToClaim: Gift[];
}

export default function Claim() {
  const {
    account,
    contract,
    hasWeb3,
    isClaimActive,
    network,
    requestConnection,
    web3,
  } = useWeb3();

  const [isClaiming, setIsClaiming] = useState(null);
  const [allSantaIds, setAllSantaIds] = useState<number[]>([]);

  const [giftGroups, setGiftGroups] = useState<GiftGroups>({
    giftsOwned: [],
    giftsToClaim: [],
  });

  const [santaIdsToClaim, setSantaIdsToClaim] = useState<number[]>([]);

  useEffect(() => {
    if (!account || !contract || !isClaimActive) {
      return;
    }

    if (network === "main") {
      // @TODO: fetch data from Paris
    } else {
      // Get all the santa ids for this wallet
      Promise.all(
        Array(20)
          .fill(0)
          .map((v, i) =>
            contract.methods
              .ownerOf(i)
              .call()
              .catch(() => "")
          )
      ).then((addrs) => {
        setAllSantaIds(
          addrs
            .map((a, i) => [a, i])
            .filter(([a]) => a === account)
            .map(([a, i]) => i)
        );
      });
    }
  }, [account, contract, isClaimActive, network]);

  useEffect(() => {
    if (!allSantaIds.length) {
      return;
    }

    Promise.all(
      allSantaIds.map((sid) =>
        contract.methods
          .getGiftByGifteeToken(sid)
          .call()
          .catch(() => null)
      )
    )
      .then((structs) => {
        giftGroups.giftsOwned = structs.filter(async (v) => {
          const isClaimed = !!v.hasClaimed;
          let isOwned = v.giftee === account;

          try {
            const giftTokenContract = await new web3.eth.Contract(
              contractAbi,
              v.nftAddress
            );

            isOwned =
              isOwned &&
              (await giftTokenContract.methods.ownerOf(v.nftTokenId)) ==
                account;
          } catch (e) {}

          return v && isClaimed && isOwned;
        });

        giftGroups.giftsToClaim = structs.filter((v) => v && !v.hasClaimed);
        console.log("giftGroups", giftGroups);

        setGiftGroups(giftGroups);
        return giftGroups.giftsToClaim.map((v) => v.gifteeTokenId);
      })
      .then(setSantaIdsToClaim);
  }, [contract, account, allSantaIds, web3]);

  const doClaim = async () => {
    setIsClaiming(true);

    try {
      await contract.methods
        .claimGifts(santaIdsToClaim)
        .send({ from: account });

      toast.success("Success!");
    } catch (e) {
      console.error(e);
      toast.error(e.message);
    }

    setIsClaiming(false);
  };

  if (isClaimActive && (!hasWeb3 || !account)) {
    return (
      <button
        className="text-xl rounded-md outline-none nice-shadow"
        onClick={requestConnection}
      >
        Connect To Claim
      </button>
    );
  }

  const hasGifts = giftGroups.giftsOwned.length;
  const hasGiftsToClaim = giftGroups.giftsToClaim.length;

  return (
    <div>
      <a className="anchor" id="claim"></a>
      <div className="flex flex-wrap justify-around w-full">
        <div className="grid justify-items-center mx-12 md:mx-0">
          <h1
            className="text-center text-3xl mb-5 underline text-shadow"
            style={{ color: "var(--color-green" }}
          >
            Claim
          </h1>
          {hasGifts || hasGiftsToClaim ? (
            <div className="flex flex-row justify-evenly">
              {!!hasGiftsToClaim && (
                <div className="w-6/12 mr-40">
                  <p className="text-3xl text-shadow mb-5">Gifts To Unwrap</p>
                  <div>
                    {giftGroups.giftsToClaim.map((g) => {
                      return (
                        <RenderNFT
                          size={371}
                          nft={{
                            contractAddress: g.nftAddress, // replace this for testing
                            tokenId: g.nftTokenId, // replace this for testing
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
              {!!hasGifts && (
                <div className="">
                  <p className="text-3xl text-shadow mb-5">Gifts Owned</p>
                  <div>
                    {giftGroups.giftsOwned.map((g) => {
                      return (
                        <RenderNFT
                          size={371}
                          nft={{
                            contractAddress: g.nftAddress, // replace this for testing
                            tokenId: g.nftTokenId, // replace this for testing
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <img
                src="/assets/advent_calendar_01.gif"
                className="rounded-md max-w-lg h-auto align-middle border-none nice-shadow"
              />

              {isClaimActive ? (
                <button
                  disabled={isClaiming || !santaIdsToClaim.length}
                  className="text-xl w-96 rounded-md outline-none nice-shadow cursor-pointer mt-8 m-auto"
                  onClick={() => doClaim()}
                >
                  {isClaiming
                    ? "Unwrapping your gifts now..."
                    : santaIdsToClaim.length
                    ? `Unwrap your ${santaIdsToClaim.length} gifts`
                    : `You Have No Gifts To Unwrap`}
                </button>
              ) : (
                <p className="text-4xl alt-font text-center mt-5">
                  {Math.floor(
                    (new Date("2021-12-25T00:00:00Z").getTime() - Date.now()) /
                      1000 /
                      60 /
                      60 /
                      24
                  )}{" "}
                  Days Until Christmas
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
