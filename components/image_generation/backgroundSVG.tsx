import RND from "./randomizer";
import { Trait } from './common';

export const backgroundPrefix = "1000_background_";

export default function Background(
  seed: number
): Trait {
  const rnd = new RND(142442 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "green_textured";
  switch (true) {
    case roll < 0.2:
      variant = "camo_grey_fill";
      break;
    case roll < 0.4:
      variant = "rainbow_gradient";
      break;
    case roll < 0.6:
      variant = "mountains";
      break;
    case roll < 0.8:
      variant = "forest";
      break;
    default:
  }

  return {
    trait_type: "background",
    value: variant,
  }
}
