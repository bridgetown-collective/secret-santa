import RND from "../randomizer";
import { Trait } from "../common";

export const mouthPrefix = "8000_mouth_";

export default function Mouth(seed: number): Trait {
  const rnd = new RND(97713 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "canine_teeth_elves";
  switch (true) {
    case roll <= 0.125 * 1:
      variant = "stitched_elves";
      break;
    case roll <= 0.125 * 2:
      variant = "cigarette_elves";
      break;
    case roll <= 0.125 * 3:
      variant = "gold_teeth_blood_elves";
      break;
    case roll <= 0.125 * 4:
      variant = "gold_teeth_elves";
      break;
    case roll <= 0.125 * 5:
      variant = "half_circle_missing_teeth_elves";
      break;
    case roll <= 0.125 * 6:
      variant = "half_circle_only_bottom_teeth_elves";
      break;
    case roll <= 0.125 * 7:
      variant = "missing_teeth_elves";
      break;

    default:
  }

  return {
    trait_type: "mouth",
    value: variant
  };
}
