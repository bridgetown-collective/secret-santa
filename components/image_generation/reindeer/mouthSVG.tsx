import RND from "../randomizer";
import { Trait } from "../common";

export const mouthPrefix = "8000_mouth_";

export default function Mouth(seed: number): Trait {
  const rnd = new RND(9118007713 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "canine_teeth_reindeer";
  switch (true) {
    case roll <= 0.111 * 1:
      variant = "coal_snowman_frown_reindeer";
      break;
    case roll <= 0.111 * 2:
      variant = "gold_teeth_reindeer";
      break;
    case roll <= 0.111 * 3:
      variant = "half_circle_missing_teeth_reindeer";
      break;
    case roll <= 0.111 * 4:
      variant = "half_circle_only_bottom_teeth_reindeer";
      break;
    case roll <= 0.111 * 5:
      variant = "lump_coal_textured_reindeer";
      break;
    case roll <= 0.111 * 6:
      variant = "missing_teeth_reindeer";
      break;
    case roll <= 0.111 * 7:
      variant = "stitched_reindeer";
      break;
    case roll <= 0.111 * 8:
      variant = "cigarette";
      break;

    default:
  }

  return {
    trait_type: "mouth",
    value: variant
  };
}
