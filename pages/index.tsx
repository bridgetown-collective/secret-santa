import fs from "fs";
import path from "path";
import "styled-jsx";

import About from "../components/about";
import { getSVGMap } from "../components/image_generation/common";
import Mint from "../components/mint";
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
    <div className="container">
      <div className="section flex-col text-center">
        <p className="text-6xl">Some Super Secret Santa Society</p>
        <p className="text-3xl m-4">
          Decking the halls December 25th, 2021 UTC
        </p>
      </div>

      <div className="section">
        <About />
      </div>

      <div className="section">
        <Mint />
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
        .section + .section {
          margin-top: 4rem;
        }
      `}</style>
    </div>
  );
}
