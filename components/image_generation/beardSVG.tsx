import RND from "./randomizer";
import { Trait } from './common';

export const beardPrefix = "7000_beard_";

export default function Beard(
  seed: number,
): Trait {
  const rnd = new RND(166382 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "scraggly_white";
  switch (true) {
    case roll <= 0.3:
      variant = "stubble_gray";
      break;
    case roll <= 0.5:
      variant = "cotton_3_points_gray"
      break;
    case roll <= 0.8:
      variant = "traditional";
      break;
    default:
  }

  return {
    trait_type: "beard",
    value: variant,
  }
}
