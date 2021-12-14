import RND from "./randomizer";
import { Trait } from "./common";

export const mouthPrefix = "8000_mouth_";

export default function Mouth(seed: number): Trait {
  const rnd = new RND(97713 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "lightning_textured";
  switch (true) {
    case roll <= 0.07:
      variant = "canine_teeth";
      break;
    case roll <= 0.14:
      variant = "cigarette";
      break;
    case roll <= 0.21:
      variant = "coal_snowman_frown";
      break;
    case roll <= 0.28:
      variant = "gold_teeth_blood";
      break;
    case roll <= 0.35:
      variant = "gold_teeth_snot";
      break;
    case roll <= 0.42:
      variant = "gold_teeth";
      break;
    case roll <= 0.49:
      variant = "half_circle_missing_teeth";
      break;
    case roll <= 0.56:
      variant = "half_circle_only_bottom_teeth";
      break;
    case roll <= 0.63:
      variant = "lump_coal_textured";
      break;
    case roll <= 0.7:
      variant = "missing_teeth";
      break;
    case roll <= 0.77:
      variant = "nutcracker_gold_teeth";
      break;
    case roll <= 0.84:
      variant = "nutcracker";
      break;
    case roll <= 0.91:
      variant = "stitched";
      break;

    default:
  }

  return {
    trait_type: "mouth",
    value: variant
  };
}
