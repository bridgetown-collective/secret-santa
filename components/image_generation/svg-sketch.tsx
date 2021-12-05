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

const SvgContainerDiv = styled.svg`
  border: 0.0625rem solid black;
  border-radius: 0.25rem;
  width: 30rem;
  height: 30rem;
  position: relative;
  overflow: hidden;
`;

// type TraitTypes = "arms" | "background" | "beard" | "body" | "brows" | "eyes" | "glasses" | "hat" | "head" | "mouth" | "nose" ;
// type Attributes = Array<{trait_type: TraitTypes, value: string}>
// 
// export const RagingSantaTraits = (
//   seed: number
// ): Attributes => {
// 
//   const traitObj
//   return {};
// }

export const RagingSantaSVGString = (
  seed: number,
  svgMap: Record<string, string>
): string => {
  const rnd = new RND(9998 * seed);

  let roll = rnd.rb(0, 1);
  const hasHat = roll < 0.8;

  roll = rnd.rb(0, 1);
  const hasArms = roll < 0.2;

  roll = rnd.rb(0, 1);
  const hasGlasses = roll < 0.1;

  const allElements = [
    Background,
    Body,
    Head,
    hasHat && Hat,
    Eyes,
    hasArms && Arms,
    Brows,
    Beard,
    Mouth,
    hasGlasses && Glasses,
    Nose,
  ]
    .filter((v) => v)
    .map((c) => c(seed, svgMap))
    .filter((v) => v);

  let final = allElements[0].split(">")[0] + ">";

  allElements.forEach((el) => {
    const parts = el.split(">");
    final += parts.slice(1, parts.length - 2).join(">") + ">";
  });

  final += "</svg>";

  return final;
};

const SvgSketch = ({
  seed,
  svgMap,
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
