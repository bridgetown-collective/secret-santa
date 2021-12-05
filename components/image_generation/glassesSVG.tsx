import RND from "./randomizer";
import { Trait } from './common';

export const glassesPrefix = "8100_glasses_";

export default function Glasses(
  seed: number,
): Trait {
  const rnd = new RND(150992 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "googly_eyes";
  switch (true) {
    case roll <= 0.2:
      variant = "googly_eyes_different_size";
      break;
    case roll <= 0.4:
      variant = "round_black_waldo_exotropia";
      break;
    case roll <= 0.6:
      variant = "ski_goggles";
      break;
    case roll <= 0.8:
      variant = "wire_square";
      break;
    default:
  }

  return {
    trait_type: "glasses",
    value: variant,
  }
}
