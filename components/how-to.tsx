export default function HowTo() {
  return (
    <div className="howto md:pl-16 md:pr-16 lg:p-10" id="howto">
      <span>
        <p className="text-2xl text-bold howto-header text-shadow">
          Step 1 - Wrap Your Gift → Mint
        </p>
        <p className="text-2xl font-extralight	">
          To mint your own Raging Santa you must provide a gift NFT of your
          choice for the Raging Santas Gift Pool.
          <br />
          <br />
          Additionally, each Raging Santa costs 0.03 ETH + gas to mint.
          <br />
          <br />
          Your Raging Santa will be proof that you gave generously to the Gift
          Pool and will also be your claim to a Free Gift on X-Mas Day!
        </p>
      </span>

      <br />
      <span>
        <p className="text-2xl text-bold howto-header text-shadow">
          Step 2 - Spread Cheer → Share
        </p>
        <p className="text-2xl font-extralight	">
          We are doing our best to get as many artists, builders, influencers,
          and every day NFT holders to give something to the Raging Santas Gift Pool.
          <br />
          <br />
          Share Your{" "}
          <a href="/gift-showcase" target="_blank">
            Gift Page
          </a>{" "}
          to show others what you generously gave to the Gift Pool. It may
          inspire others to join in on the First Ever On-Chain NFT Secret Santa
          Gift Swap!
        </p>
      </span>

      <br />
      <span>
        <p className="text-2xl text-black howto-header text-shadow">
          Step 3 - Open Your Gifts → Claim
        </p>
        <p className="text-2xl font-extralight	">
          On Christmas Day, December 25th, 2021 12:00AM ET, participants holding
          a Raging Santa NFT will be eligible to claim a random gift (1 per Raging
          Santa) from the Raging Santas Gift Pool!
          <br /> <br />
          You will have 6 months (until June 25th, 2021) to claim your gift!
          <br /> <br />
          Additionally all Raging Santas will be revealed by Christmas Day!
          <br /> <br />
          <a href="/whitepaper" target="_blank">
            How We Randomize Secret Santa Matchmaking
          </a>
        </p>
      </span>

      <style jsx global>{`
        .howto a {
          font-weight: bold;
          text-decoration: underline;
        }

        .howto p.howto-header {
          font-size: 2.25rem;
          line-height: 1.7em;
          text-decoration: underline;
          color: var(--color-green);
        }

        .howto span:nth-of-type(even) .howto-header {
          color: var(--color-pink);
        }
      `}</style>
    </div>
  );
}
