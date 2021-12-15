import styled from "styled-components";

import RND from "./randomizer";

import Arms, { armsPrefix } from "./armsSVG";
import Background, { backgroundPrefix } from "./backgroundSVG";
import Beard, { beardPrefix } from "./beardSVG";
import Body, { bodyPrefix } from "./bodySVG";
import BodyShadow, { bodyShadowPrefix } from "./bodyShadowSVG";
import Brows, { browsPrefix } from "./browsSVG"; import Eyes, { eyesPrefix } from "./eyesSVG";
import Glasses, { glassesPrefix } from "./glassesSVG";
import Hat, { hatPrefix } from "./hatSVG";
import Head, { headPrefix } from "./headSVG";
import Mouth, { mouthPrefix } from "./mouthSVG";
import Nose, { nosePrefix } from "./noseSVG";
import { Trait } from "./common";

import generateElf from './elf/index';

const SvgContainerDiv = styled.svg`
  border: 0.0625rem solid black;
  border-radius: 0.25rem;
  width: 30rem;
  height: 30rem;
  position: relative;
  overflow: hidden;
`;

const traitPrefixMap = {
  background: backgroundPrefix,
  body: bodyPrefix,
  bodyShadow: bodyShadowPrefix,
  head: headPrefix,
  hat: hatPrefix,
  eyes: eyesPrefix,
  arms: armsPrefix,
  brows: browsPrefix,
  beard: beardPrefix,
  mouth: mouthPrefix,
  glasses: glassesPrefix,
  nose: nosePrefix,
};

const generateSanta = (seed:number): Array<Trait> => {
  const rnd = new RND(9998 * seed);
  let roll = rnd.rb(0, 1);
  const hasHat = roll < 0.9;
  roll = rnd.rb(0, 1);
  const hasArms = roll < 0.2;
  roll = rnd.rb(0, 1);
  const hasGlasses = roll < 0.1;

  const traits = [];
  traits.push(Background(seed));
  traits.push(BodyShadow(seed));
  traits.push(Body(seed));
  traits.push(Head(seed));
  if (hasHat) {
    traits.push(Hat(seed));
  }
  traits.push(Eyes(seed));
  if (hasArms) {
    traits.push(Arms(seed));
  }
  traits.push(Brows(seed));
  traits.push(Beard(seed));
  traits.push(Mouth(seed));
  if (hasGlasses) {
    traits.push(Glasses(seed));
  }
  traits.push(Nose(seed));

  return traits;
}

const generateReindeer = (seed:number): Array<Trait> => {
  const traits = [];
  traits.push(Background(seed));
  return traits;
};

const generateDoodle = (seed:number): Array<Trait> => {
  const traits = [];
  traits.push(Background(seed));
  return traits;
};

export const RagingSantaTraits = (seed: number): Array<Trait> => {
  const rnd = new RND(166018 * seed);
  let roll = rnd.rb(0, 1);
  let traits = [];

  switch(true) {
    case roll < 0.95:
      traits = generateSanta(roll);
      break;
    //case roll < 0.9666:
    case roll < 1:
      traits = generateElf(roll);
      break;
    //case roll < 0.9833333:
    //  traits = generateReindeer(roll);
    //  break;
    //case roll <= 1:
    //  traits = generateDoodle(roll);
    //  break;
    default:
  }

  console.log(roll);
  console.log(traits);
  return traits;
};

export const RagingSantaSVGString = (
  seed: number,
  svgMap: Record<string, string>
): string => {
  const allElements = RagingSantaTraits(seed)
    .filter(v => v)
    .map(({ trait_type, value }): string => {
      let prefix: string = traitPrefixMap[trait_type];
      return svgMap[`${prefix}${value}.svg`];
    })
    .filter(v => v);

  let final = allElements[0].split(">")[0] + ">";

  allElements.forEach(el => {
    const parts = el.split(">");
    final += parts.slice(1, parts.length - 2).join(">") + ">";
  });

  final += "</svg>";

  return final;
};

const SvgSketch = ({
  seed,
  svgMap
}: {
  seed: number;
  svgMap: Record<string, string>;
}): JSX.Element => {
  return (
    <SvgContainerDiv
      key="0"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 800 800"
      dangerouslySetInnerHTML={{ __html: RagingSantaSVGString(seed, svgMap) }}
    />
  );
};

export default SvgSketch;
