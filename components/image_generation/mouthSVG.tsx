import RND from "./randomizer";
import { Trait } from "./common";

export const mouthPrefix = "8000_mouth_";

export default function Mouth(seed: number): Trait {
  const rnd = new RND(97713 * seed);
  const roll = rnd.rb(0, 1);

      let variant = "cigarette";
  switch (true) {
    case roll <= 0.07 * 1:
      variant = "canine_teeth";
      break;
    case roll <= 0.07 * 2:
      variant = "stitched";
      break;
    case roll <= 0.07 * 3:
      variant = "coal_snowman_frown";
      break;
    case roll <= 0.07 * 4:
      variant = "gold_teeth_blood";
      break;
    case roll <= 0.07 * 5:
      variant = "gold_teeth_snot";
      break;
    case roll <= 0.07 * 6:
      variant = "gold_teeth";
      break;
    case roll <= 0.07 * 7:
      variant = "half_circle_missing_teeth";
      break;
    case roll <= 0.07 * 8:
      variant = "half_circle_only_bottom_teeth";
      break;
    case roll <= 0.07 * 9:
      variant = "lump_coal_textured";
      break;
    case roll <= 0.07 * 10:
      variant = "missing_teeth";
      break;
    case roll <= 0.07 * 11:
      variant = "nutcracker_gold_teeth";
      break;
    case roll <= 0.07 * 12:
      variant = "nutcracker";
      break;
    case roll <= 0.07 * 13:
      variant = "lightning_textured";
      break;
    case roll <= 0.91 + 0.03:
      variant = "cigar";
      break;
    case roll <= 0.91 + 0.03 * 2:
      variant = "pipe";
      break;

    default:
  }

  return {
    trait_type: "mouth",
    value: variant
  };
}
