import { Trait } from "./../common";
import Background from "./backgroundSVG";
import BodyShadow from "./bodyShadowSVG";
import Body from "./bodySVG";
import Head from "./headSVG";
import Hat from "./hatSVG";
import Eyes from "./eyesSVG";
import Beard from "./beardSVG";
import Mouth from "./mouthSVG";

const generateScribble = (seed: number, includeShadow: boolean): Array<Trait> => {
  const traits = [];
  traits.push(Background(seed));
  if (includeShadow) {
    traits.push(BodyShadow(seed));
  }
  traits.push(Body(seed));
  traits.push(Head(seed));
  traits.push(Hat(seed));
  traits.push(Eyes(seed));
  traits.push(Beard(seed));
  traits.push(Mouth(seed));
  return traits;
};

export default generateScribble;
