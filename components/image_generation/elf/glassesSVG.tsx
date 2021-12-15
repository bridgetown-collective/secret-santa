import RND from "../randomizer";
import { Trait } from "../common";

export const glassesPrefix = "8100_glasses_";

export default function Glasses(seed: number): Trait {
  const rnd = new RND(97713 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "3d_elves";
  switch (true) {
    case roll <= 0.5:
      variant = "wire_square_elves";
      break;
    default:
  }

  return {
    trait_type: "glasses",
    value: variant
  };
}
