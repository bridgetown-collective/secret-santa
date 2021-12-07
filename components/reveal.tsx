import useWeb3 from "../lib/use-web3";

export default function Reveal() {
  useWeb3();

  return (
    <div className="flex flex-wrap justify-around w-full" id="reveal">
      <p className="text-4xl alt-font text-center">
        {Math.floor(
          (new Date("2021-12-25T00:00:00Z").getTime() - Date.now()) /
            1000 /
            60 /
            60 /
            24
        )}{" "}
        Days Until Christmas
      </p>
    </div>
  );
}
