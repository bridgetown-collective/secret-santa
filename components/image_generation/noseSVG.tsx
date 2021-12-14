import { Trait } from "./common";
import RND from "./randomizer";

export const nosePrefix = "9000_nose_";

export default function Nose(seed: number): Trait {
  const rnd = new RND(166382 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "red_paper_texture";
  switch (true) {
    case roll <= 0.04:
      variant = "carrot";
      break;
    case roll <= 0.18:
      variant = "cylinder";
      break;
    case roll <= 0.31:
      variant = "red_button_4_holes";
      break;
    case roll <= 0.45:
      variant = "red_puff_paper_texture";
      break;
    case roll <= 0.59:
      variant = "red_square_round";
      break;
    case roll <= 0.73:
      variant = "red_teardrop";
      break;
    case roll <= 0.86:
      variant = "red_triangle";
      break;

    default:
  }
    console.log('nose',variant);

  return {
    trait_type: "nose",
    value: variant
  };
}
