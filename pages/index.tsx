import "styled-jsx";

import About from "../components/about";
import FAQ from "../components/faq";
import Hero from "../components/hero";
import Mint from "../components/mint";
import Reveal from "../components/reveal";
import TheSantas from "../components/the-santas";

export default function Home() {
  return (
    <div className="inline-flex flex-col self-center mb-24">
      <div className="section flex-col text-center">
        <p className="text-6xl alt-font">Raging Santas NFT</p>
        <p className="text-xl">
          <s>FEEL the love</s> - SHARE the Rage - MINT a Santa - EXCHANGE an NFT
        </p>
      </div>

      <div className="section">
        <Hero />
      </div>

      <div className="section">
        <About />
      </div>

      <div className="section">
        <Mint />
      </div>

      <div className="section">
        <FAQ />
      </div>

      <div className="section" id="reveal">
        <Reveal />
      </div>

      <div className="section">
        <TheSantas />
      </div>

      <style jsx>{`
        .section {
          display: flex;
          justify-content: space-around;
          margin: 2rem 0;
          padding: 0 4rem;
        }

        .section:nth-of-type(even) {
          border: solid 1px black;
          padding-bottom: 2rem;
          padding-top: 2rem;
        }

        .section:first-of-type,
        #reveal {
          background-color: #f49898;
          margin-left: 0;
          margin-right: 0;
        }

        .section:first-of-type {
          padding: 4rem;
        }
      `}</style>
    </div>
  );
}
