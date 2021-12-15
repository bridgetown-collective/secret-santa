import RND from "../randomizer";
import { Trait } from "../common";

export const hatPrefix = "4000_hat_";

export default function Hat(seed: number): Trait {
  const rnd = new RND(4213222242 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "devil_horns";
  switch (true) {
    case roll <= 0.2:
      variant = "green_elf";
      break;
    case roll <= 0.4:
      variant = "hunting";
      break;
    case roll <= 0.6:
      variant = "reindeer_horns";
      break;
    case roll <= 0.8:
      variant = "two_hairs";
      break;
    default:
  }

  return {
    trait_type: "hat",
    value: variant
  };
}
