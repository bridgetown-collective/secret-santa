import RND from "./randomizer";
import { Trait } from './common';

export const hatPrefix = "4000_hat_";

export default function Hat(
  seed: number,
): Trait {
  const rnd = new RND(1222242 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "burglar_mask";
  switch (true) {
    case roll <= 0.3:
      variant = "red_triangle";
      break;
    case roll <= 0.6:
      variant = "reindeer_hand_horns_half_mask";
      break;
    case roll <= 0.8:
      variant = "reindeer_horns_half_mask";
      break;
    default:
  }

  return {
    trait_type: "hat",
    value: variant,
  }
}
