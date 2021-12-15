import RND from "../randomizer";
import { Trait } from "../common";

export const mouthPrefix = "8000_mouth_";

export default function Mouth(seed: number): Trait {
  const rnd = new RND(9719010222713 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "canine_teeth_scrib";
  switch (true) {
    case roll <= 0.33333:
      variant = "coal_snowman_frown_scrib";
      break;
    case roll <= 0.66666:
      variant = "d_subset_tongue_scrib";
      break;
    default:
  }

  return {
    trait_type: "mouth",
    value: variant
  };
}
