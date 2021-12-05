import RND from "./randomizer";
import { Trait } from './common';

export const browsPrefix = "6000_brows_";

export default function Brows(
  seed: number,
): Trait {
  const rnd = new RND(79182 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "bushy_black";
  switch (true) {
    case roll <= 0.5:
      variant = "unibrow_white";
      break;
    default:
  }

  return {
    trait_type: "brows",
    value: variant,
  }
}
