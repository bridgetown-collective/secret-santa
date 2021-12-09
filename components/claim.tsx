import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import useWeb3 from "../lib/use-web3";

export default function Claim() {
  const {
    account,
    contract,
    hasWeb3,
    isClaimActive,
    network,
    requestConnection,
  } = useWeb3();

  const [isClaiming, setIsClaiming] = useState(null);
  const [allSantaIds, setAllSantaIds] = useState<number[]>([]);
  const [santaIdsToClaim, setSantaIdsToClaim] = useState<number[]>([]);

  useEffect(() => {
    if (!account || !contract || !isClaimActive) {
      return;
    }

    if (network === "main") {
      // @TODO: fetch data from Paris
    } else {
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
    if (!santaIdsToClaim.length) {
      return;
    }

    Promise.all(
      santaIdsToClaim.map((sid) =>
        contract.methods
          .getGiftByGifteeToken(sid)
          .call()
          .catch(() => null)
      )
    )
      .then((structs) => structs.filter((v) => v && !v.hasClaimed))
      .then(setSantaIdsToClaim);
  }, [contract, allSantaIds]);

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
                : `Unwrap your ${santaIdsToClaim.length} gifts`}
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
        </div>
      </div>
    </div>
  );
}
