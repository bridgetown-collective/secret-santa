import { Trait } from "./../common";
import Background from "../backgroundSVG";
import BodyShadowElves from "./bodyShadowSVG";
import Body from "./bodySVG";

const generateElf = (seed:number): Array<Trait> => {
  const traits = [];
  traits.push(Background(seed));
  traits.push(BodyShadowElves(seed));
  traits.push(Body(seed));
  return traits;
};

export default generateElf;
