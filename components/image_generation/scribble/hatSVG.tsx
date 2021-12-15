import RND from "../randomizer";
import { Trait } from "../common";

export const hatPrefix = "4000_hat_";

export default function Hat(seed: number): Trait {
  const rnd = new RND(1323222242 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "green_elf_scrib";
  switch (true) {
    case roll <= 0.2:
      variant = "hunting_scrib";
      break;
    case roll <= 0.4:
      variant = "red_triangle_scrib";
      break;
    case roll <= 0.6:
      variant = "reindeer_horns_scrib";
      break;
    case roll <= 0.8:
      variant = "two_hairs_scrib";
      break;

    default:
  }

  return {
    trait_type: "hat",
    value: variant
  };
}
