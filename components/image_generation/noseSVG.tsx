import { Trait } from "./common";
import RND from "./randomizer";

export const nosePrefix = "9000_nose_";

export default function Nose(seed: number): Trait {
  const rnd = new RND(166382 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "red_paper_texture";
  switch (true) {
    case roll <= 0.5:
      variant = "carrot";
      break;
    default:
  }

  return {
    trait_type: "nose",
    value: variant
  };
}
