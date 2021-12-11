import "styled-jsx";
import GiftWrapper from "../components/gift";
import { Gift } from "../components/claim";
import { useEffect, useState } from "react";
import useWeb3 from "../lib/use-web3";
import contractAbi from "../lib/contract-abi";

export default function GiftPage() {
  const { account, contract, contractAddress, isClaimActive, network, web3 } =
    useWeb3();

  const [mySantaIds, setMySantaIds] = useState<number[]>([]);
  const [giftsOwned, setGiftsOwned] = useState<Gift[]>([]);
  const [giftsToClaim, setGiftsToClaim] = useState<Gift[]>([]);
  const [santaIdsToClaim, setSantaIdsToClaim] = useState<number[]>([]);

  useEffect(() => {
    console.log("what");
    console.log(contract)
    console.log(contractAddress)
    if (!account || !contract || !contractAddress) {
      return;
    }
    console.log("here");

    if (network === "main") {
      // @TODO: fetch data from Paris
    } else {
      console.log("hi");
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
      ).then(addrs => {
        console.log("hi", addrs);
        setMySantaIds(
          addrs
            .map((a, i) => [a, i])
            .filter(([a]) => a === account)
            .map(([a, i]) => i)
        );
      });
    }
  }, [account, contract, contractAddress, network]);

  useEffect(() => {
    if (!mySantaIds.length) {
      return;
    }

    Promise.all(
      mySantaIds.map(sid =>
        contract.methods
          .getGiftByGifteeToken(sid)
          .call()
          .catch(() => null)
      )
    )
      .then(structs => {
        setGiftsOwned(
          structs.filter(async v => {
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
          })
        );

        setGiftsToClaim(structs.filter(v => v && !v.hasClaimed));
        return giftsToClaim.map(v => v.gifteeTokenId);
      })
      .then(setSantaIdsToClaim);
  }, [contract, account, contractAddress, network, mySantaIds]);

  console.log("santaids", mySantaIds);
  console.log("giftsToClaim", giftsToClaim);
  console.log("giftsOwned", giftsOwned);
  return (
    <div className="flex-col justify-center flex-wrap mt-32 mb-24 w-full">
      {!!mySantaIds.length && (
        <div className="flex flex-wrap justify-evenly mb-20">
          <span
            className="text-5xl xl:text-7xl tracking-tight text-shadow-green"
            style={{ fontFamily: "LogoFont" }}
          >
            My Santas
          </span>
          <div className="break"></div>
          {mySantaIds.map(i => (
            <GiftWrapper gifterTokenId={i} key={i}/>
          ))}
        </div>
      )}
      {!!santaIdsToClaim.length && (
        <div className="flex flex-wrap justify-evenly mb-20">
          <span
            className="text-5xl xl:text-7xl tracking-tight text-shadow-green"
            style={{ fontFamily: "LogoFont" }}
          >
            Gifts Present
          </span>
          <div className="break"></div>
          {santaIdsToClaim.map(i => (
            <GiftWrapper gifteeTokenId={i} key={i}/>
          ))}
        </div>
      )}
      {!!giftsOwned.length && (
        <div className="flex flex-wrap justify-evenly">
          <span
            className="text-5xl xl:text-7xl tracking-tight text-shadow-green"
            style={{ fontFamily: "LogoFont" }}
          >
            Gifts Past
          </span>
          <div className="break"></div>
          {giftsOwned.map((i, idx) => (
            <GiftWrapper gift={i} key={idx} />
          ))}
        </div>
      )}
      <style jsx>{`
        .break {
          flex-basis: 100%;
          height: 0;
        }
      `}</style>
    </div>
  );
}
