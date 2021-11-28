import fs from "fs";
import path from "path";
import Head from "next/head";
import { useEffect, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import { getSVGMap } from "../components/image_generation/common";
import SvgSketch from "../components/image_generation/svg-sketch";

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
      svgMap: getSVGMap(fs, path),
    },
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

  return (
    <>
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
    </>
  );
};

export default function Demo({ svgMap }) {
  return (
    <div
      id="body"
      className="flex flex-col items-center justify-center min-h-screen py-2"
    >
      <Head>
        <title>Demo</title>
      </Head>
      <div>
        <header>
          <>
            <WrappedSvgSketch svgMap={svgMap} />
          </>
        </header>
      </div>
    </div>
  );
}
