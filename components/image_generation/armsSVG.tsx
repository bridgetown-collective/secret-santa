import RND from "./randomizer";
import { Trait } from './common';

export const armsPrefix = "5100_arms_";

export default function Arms(
  seed: number,
): Trait{
  const rnd = new RND(150992 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "toothpicks";
  switch (true) {
    default:
  }

  return {
    trait_type: "arms",
    value: variant,
  }
}
