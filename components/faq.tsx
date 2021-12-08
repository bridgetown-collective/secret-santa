import Link from "next/link";

export default function FAQ() {
  return (
    <div className="faq md:pl-16 md:pr-16 lg:p-10">
      <a className="anchor" id="faq"></a>
      <div>
        <h1
          className="text-center text-3xl mb-5 underline text-shadow"
          style={{ color: "var(--color-pink)" }}
        >
          The Details
        </h1>
      </div>

      <br />
      <span>
        <p className="text-xl">
          🎄 How many Raging Santa NFTs will be Mintable?
        </p>
        <p className="text-lg">
          9,999 Raging Santas will be mintable starting on Monday, December
          13th, 2021 10:00AM ET.
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
        <p className="text-xl">🎁 What will I receive if I mint?</p>
        <p className="text-lg">
          <b>Immediately:</b> A one of a kind Raging Santa NFT - rage on!
          <br />
          <b>December 25th:</b> Starting on Christmas Day, the owner of any
          Raging Santa NFT will be able to claim a random, gifted NFT 🎁 (or
          regift to a wallet of choice) from the Raging Santas Gift Pool.
        </p>
      </span>

      <br />
      <span>
        <p className="text-xl">
          💸 How do I ensure that the random gift I receive will be valuable?{" "}
        </p>
        <p className="text-lg">
          You don't!
          <br />
          That is the fun of a Secret Santa Swap! (Psst, What do you think these
          Raging Santas are Raging about?)
          <br />
          Some participants may give high-value NFTs while others may give more
          obscure or sentimental ones.
          <br />
          You can always{" "}
          <Link href="https://twitter.com/RagingSantasNFT">
            <a target="_blank" rel="noreferrer">
              <u className="cursor-pointer">check us out on Twitter</u>
            </a>
          </Link>{" "}
          to see the latest featured NFTs added to the Gift Pool!
        </p>
      </span>

      <br />
      <span>
        <p className="text-xl">🧐  Please Keep in Mind </p>
        <ul className="text-lg ml-5" style={{ listStyle: "default" }}>
          <li>
            Raging Santas NFT is not responsible for the quality or value of
            gifts given or received.
          </li>
          <li>You may end up with gold OR a lump-of-coal!</li>
          <li>This is an experimental project with cutting edge technology.</li>
          <li>Participate in the swap at your own risk!</li>
          <li>
            A Raging Santa purchased on a secondary market at a later date may
            have already been used to claim a gift.
          </li>
        </ul>
      </span>

      <br />
      <span>
        <p className="text-xl">🔮 What does the future hold?</p>
        <p className="text-lg">
          There is no roadmap. This is simply the first of hopefully many swaps!
          We may run it back! You never know where Santa might show up next!
          <br />
          There is no currently no Discord. We are committed to rolling out a
          Discord server if we hit 25% sold out.
          <br />
          We love the Holiday Season! Everything done is in the spirit of good vibes, giving
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
      <style jsx global>{`
        .faq p.text-xl {
          font-size: 2.25rem;
          line-height: 1.7em;
          color: var(--color-green);
        }

        .faq span:nth-of-type(even) .text-xl {
          color: var(--color-pink);
        }
      `}</style>
    </div>
  );
}
