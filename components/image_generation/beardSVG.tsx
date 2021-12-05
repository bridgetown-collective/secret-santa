import RND from "./randomizer";
import { Trait } from './common';

export const beardPrefix = "7000_beard_";

export default function Beard(
  seed: number,
): Trait {
  const rnd = new RND(166382 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "green_bow";
  switch (true) {
    case roll <= 0.5:
      variant = "traditional";
      break;
    case roll <= 0.8:
      variant = "falling_off";
      break;
    default:
  }

  return {
    trait_type: "beard",
    value: variant,
  }
}
