import Link from "next/link";

export default function FAQ() {
  return (
    <div>
      <p className="text-xl">What is the mint fee?</p>
      <p className="text-md">
        0.03 ETH + 1 NFT of your choice to add to the Secret Santa Swap gift
        pool.
        <br />
        View the current gift pool{" "}
        <Link href="/the-pool">
          <u className="cursor-pointer">here</u>
        </Link>
        .
      </p>

      <br />
      <p className="text-xl">What does it get you?</p>
      <p className="text-md">
        1. A one of a kind Raging Santa NFT - rage on!
        <br />
        2. Starting on Christmas Day, the holder of any Raging Santa NFT will be
        able to claim a random, gifted NFT (or regift to a wallet of choice).
      </p>

      <br />
      <p className="text-xl">When?</p>
      <p className="text-md">
        9999 Raging Santas will be released starting December 8th, 2021.
        <br />
        Follow us on{" "}
        <Link href="https://twitter.com/RagingSantasNFT">
          <a target="_blank" rel="noreferrer">
            <u className="cursor-pointer">Twitter</u>
          </a>
        </Link>{" "}
        for the most up to date information.
      </p>

      <br />
      <p className="text-xl">What does the future hold?</p>
      <p className="text-md">
        There is no roadmap. This is simply the first of many swaps! We will run
        it back so hold onto your Santas!
        <br />
        We will roll out a Discord server if we hit 25%.
        <br />
        We love the Holiday Season! Everything done is in the spirit of giving
        and spreading cheer!
        <br />
        We are always open to community feedback!
      </p>

      <br />
      <p className="text-xl">Disclaimer</p>
      <p className="text-md">
        This is an experiment.
        <br />
        Raging Santas NFT is not responsible for the quality or value of gifts
        given or received.
        <br />
        You may end up with gold OR a lump-of-coal!
        <br />
        So participate in the swap at your own risk!
      </p>
    </div>
  );
}
