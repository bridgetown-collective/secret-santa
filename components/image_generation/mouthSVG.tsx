import RND from "./randomizer";
import { Trait } from './common';

export const mouthPrefix = "8000_mouth_";

export default function Mouth(
  seed: number,
): Trait {
  const rnd = new RND(97713 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "lightning_textured";
  switch (true) {
    case roll <= 0.666:
      variant = "missing_teeth";
      break;
    default:
  }

  return {
    trait_type: "mouth",
    value: variant,
  }
}
