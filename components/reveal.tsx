import RequireWeb3 from "./require-web3";

function Reveal() {
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

export default function WrappedMint() {
  return RequireWeb3(<Reveal />);
}
