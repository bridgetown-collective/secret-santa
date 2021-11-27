import { useEffect, useState } from "react";
import styled from "styled-components";

import RND from "./randomizer";

import Arms from "./armsSVG";
import Background from "./backgroundSVG";
import Beard from "./beardSVG";
import Body from "./bodySVG";
import Brows from "./browsSVG";
import Eyes from "./eyesSVG";
import Glasses from "./glassesSVG";
import Hat from "./hatSVG";
import Head from "./headSVG";
import Mouth from "./mouthSVG";
import Nose from "./noseSVG";

const CanvasDiv = styled.svg`
  border: 0.0625rem solid black;
  border-radius: 0.25rem;
  width: 30rem;
  height: 30rem;
  position: relative;
  overflow: hidden;
`;

const SvgSketch = ({ seed }: { seed: number }): JSX.Element => {
  const rnd = new RND(parseInt((9998 * seed).toString()));

  let roll = rnd.rb(0, 1);
  const hasHat = roll < 0.8;

  roll = rnd.rb(0, 1);
  const hasArms = roll < 0.2;

  roll = rnd.rb(0, 1);
  const hasGlasses = roll < 0.1;

  return (
    <CanvasDiv
      key="0"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 800 800"
    >
      <Background seed={seed} />
      <Body seed={seed} />
      <Head seed={seed} />
      {hasHat && <Hat seed={seed} />}
      <Eyes seed={seed} />
      {hasArms && <Arms seed={seed} />}
      <Brows seed={seed} />
      <Beard seed={seed} />
      <Mouth seed={seed} />
      {hasGlasses && <Glasses seed={seed} />}
      <Nose seed={seed} />
    </CanvasDiv>
  );
};

export default SvgSketch;
