import RND from "../randomizer";
import { Trait } from "./../common";
import Background from "../backgroundSVG";
import BodyShadowElves from "./bodyShadowSVG";
import Body from "./bodySVG";
import Head from "./headSVG";
import Hat from "./hatSVG";
import Eyes from "./eyesSVG";
import Arms from "./armsSVG";
import Mouth from "./mouthSVG";
import Glasses from "./glassesSVG";
import Nose from "./noseSVG";

const generateElf = (seed: number, includeShadow: boolean): Array<Trait> => {
  const rnd = new RND(18298 * seed);

  let roll = rnd.rb(0, 1);
  const hasArms = roll < 0.2;
  roll = rnd.rb(0, 1);
  const hasGlasses = roll < 0.1;

  const traits = [];
  traits.push(Background(seed));
  if (includeShadow) {
    traits.push(BodyShadowElves(seed));
  }
  traits.push(Body(seed));
  traits.push(Head(seed));
  traits.push(Hat(seed));
  traits.push(Eyes(seed));
  if (hasArms) {
    traits.push(Arms(seed));
  }
  traits.push(Mouth(seed));
  if (hasGlasses) {
    traits.push(Glasses(seed));
  }
  traits.push(Nose(seed));
  return traits;
};

export default generateElf;
