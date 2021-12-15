import RND from "../randomizer";
import { Trait } from "../common";

export const eyesPrefix = "5000_eyes_";

export default function Eyes(seed: number): Trait {
  const rnd = new RND(1519076642 * seed);
  const roll = rnd.rb(0, 1);
  let variant = "black_dots_scrib";

  switch (true) {
    case roll <= 0.33333:
      variant = "frowns_scrib";
      break;
    case roll <= 0.66666:
      variant = "hearts_scrib";
      break;

    default:
  }

  return {
    trait_type: "eyes",
    value: variant
  };
}
