import RND from "../randomizer";
import { Trait } from "./../common";
import Background from "../backgroundSVG";
import BodyShadow from "../bodyShadowSVG";
import Body from "./bodySVG";
import Head from "./headSVG";
import Hat from "./hatSVG";
import Eyes from "./eyesSVG";
import Arms from "./armsSVG";
import Mouth from "./mouthSVG";
import Glasses from "./glassesSVG";
import Nose from "./noseSVG";

const generateReindeer = (seed: number): Array<Trait> => {
  const rnd = new RND(16662348298 * seed);

  let roll = rnd.rb(0, 1);
  const hasGlasses = roll < 0.1;

  const traits = [];
  traits.push(Background(seed));
  traits.push(BodyShadow(seed));
  traits.push(Body(seed));
  traits.push(Head(seed));
  traits.push(Hat(seed));
  traits.push(Eyes(seed));
  traits.push(Arms(seed));
  traits.push(Mouth(seed));
  if (hasGlasses) {
    traits.push(Glasses(seed));
  }
  traits.push(Nose(seed));
  return traits;
};

export default generateReindeer;
