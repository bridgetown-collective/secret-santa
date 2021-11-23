import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";

import Slider from "rc-slider";
import RND from "./randomizer";
import "rc-slider/assets/index.css";

import Background from './backgroundSVG';
import Head from './headSVG';
import Body from './bodySVG';
import Hat from './hatSVG';
import Eyes from './eyesSVG';
import Arms from './armsSVG';
import Brows from './browsSVG';
import Beard from './beardSVG';
import Mouth from './mouthSVG';
import Glasses from './glassesSVG';
import Nose from './noseSVG';

const CanvasDiv = styled.div`
  border: 0.0625rem solid black;
  border-radius: 0.25rem;
  width: 30rem;
  height: 30rem;
  position: relative;
  overflow: hidden;
`;

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}

const SvgSketch = function () {
  const [value, setValue] = useState(0.74);

  // Read the url query param: `seed`
  useEffect(() => {
    let querySeed = parseInt(getQueryVariable("seed"));
    if (querySeed) {
      setValue(querySeed / 1000);
    }
  }, []);

  const rnd = new RND(parseInt(9998 * value));
  const objectsToRender = [];
  const onSliderChange = setValue;

  let roll = rnd.rb(0,1) 
  const hasHat = roll < 0.8;

  roll = rnd.rb(0,1) 
  const hasArms = roll < 0.2;

  roll = rnd.rb(0,1) 
  const hasGlasses = roll < 0.1;

  return (
    <>
      <label>Seed: {value}</label>
      <Slider
        value={value}
        min={0}
        max={1}
        step={0.001}
        onChange={onSliderChange}
        style={{ marginBottom: "2rem" }}
      />
      <CanvasDiv key="0" rnd={rnd}>
        <Background seed={value} />
        <Body seed={value} />
        <Head seed={value} />
        {hasHat && (
          <Hat seed={value} />
        )}
        <Eyes seed={value} />
        {hasArms && (
          <Arms seed={value} />
        )}
        <Brows seed={value} />
        <Beard seed={value} />
        <Mouth seed={value} />
        {hasGlasses && (
          <Glasses seed={value} />
        )}
        <Nose seed={value} />
      </CanvasDiv>
    </>
  );
};

export default SvgSketch;
