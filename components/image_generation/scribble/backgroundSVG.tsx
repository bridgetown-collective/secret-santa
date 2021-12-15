import RND from "../randomizer";
import { Trait } from "../common";

export const backgroundPrefix = "1000_background_";

export default function Background(seed: number): Trait {
  const rnd = new RND(14124242 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "blue_scrib";

  switch (true) {
    case roll < 0.5:
      variant = "pink_scrib";
      break;
    default:
  }

  return {
    trait_type: "background",
    value: variant
  };
}
