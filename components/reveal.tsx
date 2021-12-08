import useWeb3 from "../lib/use-web3";

export default function Reveal() {
  useWeb3();

  return (
    <div>
      <a className="anchor" id="reveal"></a>
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
        </div>
      </div>
    </div>
  );
}
