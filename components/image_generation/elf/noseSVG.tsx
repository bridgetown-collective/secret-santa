import { Trait } from "../common";
import RND from "../randomizer";

export const nosePrefix = "9000_nose_";

export default function Nose(seed: number): Trait {
  const rnd = new RND(166382 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "groucho_elves";
  switch (true) {
    case roll <= 0.1666 * 1:
      variant = "blue_paper_texture_elves";
      break;
    case roll <= 0.1666 * 2:
      variant = "cylinder_elves";
      break;
    case roll <= 0.1666 * 3:
      variant = "green_paper_texture_elves";
      break;
    case roll <= 0.1666 * 4:
      variant = "red_paper_texture_elves";
      break;
    case roll <= 0.1666 * 5:
      variant = "red_triangle_elves";
      break;

    default:
  }

  return {
    trait_type: "nose",
    value: variant
  };
}
