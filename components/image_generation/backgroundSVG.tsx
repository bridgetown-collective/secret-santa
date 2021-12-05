import RND from "./randomizer";
import { Trait } from './common';

export const backgroundPrefix = "1000_background_";

export default function Background(
  seed: number
): Trait {
  const rnd = new RND(142442 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "baby_blue";
  switch (true) {
    case roll < 0.333:
      variant = "green";
      break;
    case roll < 0.666:
      variant = "pink";
      break;
    default:
  }

  return {
    trait_type: "background",
    value: variant,
  }
}
