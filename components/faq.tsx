import Link from "next/link";

export default function FAQ() {
  return (
    <div className="faq md:pl-16 md:pr-16 xl:p-10">
      <a className="anchor" id="faq"></a>
      <div>
        <h1
          className="text-center text-3xl mb-5 underline text-shadow"
          style={{ color: "var(--color-pink)" }}
        >
          F.A.Q
        </h1>
      </div>

      <br />
      <span>
        <p className="text-2xl  text-shadow">
          🎄 How many Raging Santa NFTs will be Mintable?
        </p>
        <p className="text-xl">
          9,999 Raging Santas will be mintable starting on Thursday, December
          16th, 2021 10:00AM ET.
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
        <p className="text-2xl  text-shadow">
          🎁 What will I receive if I mint?
        </p>
        <p className="text-xl">
          <b>Immediately:</b> A one of a kind Raging Santa NFT - rage on!
          <br />
          <b>December 25th:</b> Starting on Christmas Day, the owner of any
          Raging Santa NFT will be able to claim a random, gifted NFT 🎁 from the Raging Santas Gift Swap.
        </p>
      </span>

      <br />
      <span>
        <p className="text-2xl  text-shadow">
          💸 How do I ensure that the random gift I receive will be valuable?{" "}
        </p>
        <p className="text-xl">
          You don't!
          <br />
          That is part of the fun of a Secret Santa Swap! (Psst, What do you think these
          Raging Santas are Raging about?)
          <br />
          Some participants may decide to give high-value NFTs while others may give more
          obscure or sentimental ones.
          <br />
          You can always{" "}
          <Link href="https://twitter.com/RagingSantasNFT">
            <a target="_blank" rel="noreferrer">
              <u className="cursor-pointer">check us out on Twitter</u>
            </a>
          </Link>{" "}
          to see the latest featured NFTs added to the Gift Swap!
        </p>
      </span>

      <br />
      <span>
        <p className="text-2xl  text-shadow">
          🧐 Please Keep in Mind{" "}
        </p>
        <p className="text-xl">
          Raging Santas NFT is not responsible for the quality or value of gifts
          given or received.
          <br />
          You may end up with gold OR a lump-of-coal!
          <br />
          This is an experimental game-theory based project using blockchain technology.
          <br />
          Participate in the swap at your own risk!
          <br />
          <br />Be mindful that a Raging Santa purchased on a secondary market at a later date
          may have already been used to claim a gift from the giftpool.
        </p>
      </span>

      <br />
      <span>
        <p className="text-2xl  text-shadow">
          🔮 What does the future hold after Christmas?
        </p>
        <p className="text-xl">
          This is simply the first of hopefully many swaps! We may run it back!
          You never know where Santa might show up next!
          <br />
          There is no currently no Discord server. We are committed to rolling
          out a Discord server if we hit 25% sold out.
          <br />
          We love the Holiday Season! Everything done is in the spirit of good
          vibes, giving and spreading cheer!
          <br />
          We are always open to community feedback! Message us on{" "}
          <Link href="https://twitter.com/RagingSantasNFT">
            <a target="_blank" rel="noreferrer">
              <u className="cursor-pointer">Twitter</u>
            </a>
          </Link>{" "}
        </p>
      </span>
      <style jsx global>{`
        .faq p.text-2xl {
          font-size: 2.25rem;
          line-height: 1.7em;
          color: var(--color-green);
        }

        .faq span:nth-of-type(even) .text-2xl {
          color: var(--color-pink);
        }
      `}</style>
    </div>
  );
}
