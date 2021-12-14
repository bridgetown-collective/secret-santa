import RND from "./randomizer";
import { Trait } from './common';

export const glassesPrefix = "8100_glasses_";

export default function Glasses(
  seed: number,
): Trait {
  const rnd = new RND(97713 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "ski_goggles";
  switch (true) {
    case roll <= 0.25:
        variant ="3d";
    break;
    case roll <= 0.5:
        variant ="reading";
    break;
    case roll <= 0.75:
        variant ="wire_square";
    break;
    default:
  }

  return {
    trait_type: "glasses",
    value: variant,
  }
}
