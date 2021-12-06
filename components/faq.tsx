import Link from "next/link";

export default function FAQ() {
  return (
    <div className='faq p-20'>
      <span>
      <p className="text-xl">What is the mint fee?</p>
      <p className="text-lg">
        0.03 ETH + 1 NFT of your choice to add to the Secret Santa Swap gift
        pool.
        <br />
        View the current gift pool{" "}
        <Link href="/the-pool">
          <u className="cursor-pointer">here</u>
        </Link>
        .
      </p>
      </span>

      <br />
      <span>
      <p className="text-xl">What do you get?</p>
      <p className="text-lg">
        1. A one of a kind Raging Santa NFT - rage on!
        <br />
        2. Starting on Christmas Day, the holder of any Raging Santa NFT will be
        able to claim a random, gifted NFT (or regift to a wallet of choice) from the gift pool.
      </p>
      </span>

      <br />
      <span>
      <p className="text-xl">When does it happen?</p>
      <p className="text-lg">
        9999 Raging Santas will be mintable starting December 13th, 2021.
        <br />
        Follow us on{" "}
        <Link href="https://twitter.com/RagingSantasNFT">
          <a target="_blank" rel="noreferrer">
            <u className="cursor-pointer">Twitter</u>
          </a>
        </Link>{" "}
        for the most up to date information.
      </p>
      </span>

      <br />
      <span>
      <p className="text-xl">What does the future hold?</p>
      <p className="text-lg">
        There is no roadmap. This is simply the first of many swaps! We will run
        it back so hold onto your Santas for additional value!
        <br />
        We will roll out a Discord server if we hit 25% sold out.
        <br />
        We love the Holiday Season! Everything done is in the spirit of giving
        and spreading cheer!
        <br />
        We are always open to community feedback! Message us on{" "}
        <Link href="https://twitter.com/RagingSantasNFT">
          <a target="_blank" rel="noreferrer">
            <u className="cursor-pointer">Twitter</u>
          </a>
        </Link>{" "}
      </p>
      </span>

      <br />
      <span>
      <p className="text-xl">Disclaimer</p>
      <p className="text-lg">
        This is an experimental project.
        <br />
        Raging Santas NFT is not responsible for the quality or value of gifts
        given or received.
        <br />
        You may end up with gold OR a lump-of-coal!
        <br />
        So participate in the swap at your own risk!
      </p>
      </span>

      <style jsx global>{`
        .faq p.text-xl {
          font-size: 2.25rem;
          line-height: 1.70em;
          color: var(--color-green);
        }

        .faq span:nth-of-type(even) .text-xl {
          color: var(--color-pink);
        }

      `}</style>
    </div>
  );
}
