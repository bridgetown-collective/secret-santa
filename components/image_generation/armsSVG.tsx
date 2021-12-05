import RND from "./randomizer";
import { Trait } from './common';

export const armsPrefix = "5100_arms_";

export default function Arms(
  seed: number,
): Trait{
  const rnd = new RND(150992 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "black";
  switch (true) {
    case roll <= 0.5:
      variant = "popsicle_sticks";
      break;
    default:
  }

  return {
    trait_type: "arms",
    value: variant,
  }
}
