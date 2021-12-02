import fs from "fs";
import path from "path";
import "styled-jsx";

import About from "../components/about";
import FAQ from "../components/faq";
import Hero from "../components/hero";
import { getSVGMap } from "../components/image_generation/common";
import Mint from "../components/mint";
import Reveal from "../components/reveal";
import TheSantas from "../components/the-santas";

export function getStaticProps() {
  return {
    props: {
      // @NOTE: this has to be done server side to leverage fs
      svgMap: getSVGMap(fs, path),
    },
  };
}

export default function Home({ svgMap }) {
  return (
    <div className="inline-flex flex-col self-center m-6 mb-24">
      <div className="section flex-col text-center">
        <p className="text-6xl alt-font">Raging Santas NFT</p>
        <p className="text-xl">
          A generative collection of raging santas on the Ethereum blockchain,
          just in time for the holidays
        </p>
      </div>

      <div className="section">
        <Hero />
      </div>

      <div className="section">
        <About />
      </div>

      <div className="section">
        <Mint svgMap={svgMap} />
      </div>

      <div className="section">
        <FAQ />
      </div>

      <div className="section">
        <Reveal />
      </div>

      <div className="section">
        <TheSantas svgMap={svgMap} />
      </div>

      <style jsx>{`
        .section {
          display: flex;
          justify-content: space-around;
          margin: 2rem 0;
        }

        .section:nth-of-type(even) {
          border: solid 1px black;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
}
