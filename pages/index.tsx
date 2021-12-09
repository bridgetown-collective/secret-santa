import "styled-jsx";

import Claim from "../components/claim";
import FAQ from "../components/faq";
import Hero from "../components/hero";
import HowTo from "../components/how-to";
import Mint from "../components/mint";
import TheSantas from "../components/the-santas";

export default function Home() {
  return (
    <div className="inline-flex flex-col self-center mb-24">
      <div className="section mx-12 md:mx-0 justify-center md:justify-start relative">
        <Hero />
      </div>

      <div className="section justify-around mx-12 md:mx-0">
        <HowTo />
      </div>

      <div className="section justify-around mx-12 md:mx-0">
        <Mint />
      </div>

      <div className="section justify-around mx-12 md:mx-0">
        <Claim />
      </div>

      <div className="section justify-around mx-12 md:mx-0">
        <FAQ />
      </div>

      <div className="section justify-around mx-12 md:mx-0">
        <TheSantas />
      </div>

      <style jsx>{`
        .section {
          display: flex;
          margin: 2rem;
          padding: 2rem 4rem;
        }

        .section {
          background: url("/assets/cardboard.png");
          background-color: #7f3c10;
          border-radius: 1em;
          color: #ffa;
          box-shadow: var(--shadow-elevation-high-red);
        }

        .section:first-of-type {
          margin-top: 8em;
        }
      `}</style>
    </div>
  );
}
