import RND from "./randomizer";
import { Trait } from './common';

export const glassesPrefix = "8100_glasses_";

export default function Glasses(
  seed: number,
): Trait {
  const rnd = new RND(150992 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "ski_goggles";
  switch (true) {
    default:
  }

  return {
    trait_type: "glasses",
    value: variant,
  }
}
