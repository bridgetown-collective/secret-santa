import { Trait } from "../common";
import RND from "../randomizer";

export const nosePrefix = "9000_nose_";

export default function Nose(seed: number): Trait {
  const rnd = new RND(1660003182 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "cylinder";
  switch (true) {
    case roll <= 0.25:
      variant = "red_paper_texture";
      break;
    case roll <= 0.5:
      variant = "red_puff_paper_texture";
      break;
    case roll <= 0.75:
      variant = "red_triangle";
      break;

    default:
  }

  return {
    trait_type: "nose",
    value: variant
  };
}
