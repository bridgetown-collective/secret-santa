import "styled-jsx";
import fs from "fs";
import path from "path";
import Head from "next/head";
import { useEffect, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import { getSVGMap } from "../components/image_generation/common";
import SvgSketch, {
  RagingSantaTraits
} from "../components/image_generation/svg-sketch";

function getQueryVariable(variable: string): string {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return "";
}

export function getStaticProps() {
  return {
    props: {
      // @NOTE: this has to be done server side to leverage fs
      svgMap: getSVGMap(fs, path)
    }
  };
}

const WrappedSvgSketch = ({ svgMap }): JSX.Element => {
  const [seed, setSeed] = useState<number>(0.74);

  // Read the url query param: `seed`
  useEffect(() => {
    let querySeed = parseInt(getQueryVariable("seed"));
    if (querySeed) {
      setSeed(querySeed / 1000);
    }
  }, []);

  const allElements = RagingSantaTraits(seed, true);

  return (
    <>
      <div className="inline-block">
      <label>Seed: {seed}</label>
      <Slider
        value={seed}
        min={0}
        max={1}
        step={0.001}
        onChange={setSeed}
        style={{ marginBottom: "2rem" }}
      />
      <SvgSketch seed={seed} svgMap={svgMap} />
      </div>
      <div className="section flex flex-col ml-10">
        {allElements.map(({trait_type, value}) => (
          <div className="mb-5">
            <div>{trait_type}</div>
            <span className="pl-5 pt-5">{value}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default function Demo({ svgMap }) {
  return (
    <div>
      <div
        id="body"
        className=""
      >
        <Head>
          <title>Demo</title>
        </Head>
        <div>
          <header
        className="flex flex-row mt-40"
          >
            <>
              <WrappedSvgSketch svgMap={svgMap} />
            </>
          </header>
        </div>
      </div>
    </div>
  );
}
