import RND from "../randomizer";
import { Trait } from "../common";

export const hatPrefix = "4000_hat_";

export default function Hat(seed: number): Trait {
  const rnd = new RND(1222242 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "green_elf_elves";
  switch (true) {
    case roll <= 0.14 * 1:
      variant = "camoflauge_elves";
      break;
    case roll <= 0.14 * 2:
      variant = "energy_dome_elves";
      break;
    case roll <= 0.14 * 3:
      variant = "green_elf_elves";
      break;
    case roll <= 0.14 * 4:
      variant = "jester_elves";
      break;
    case roll <= 0.14 * 5:
      variant = "red_triangle_elves";
      break;
    case roll <= 0.14 * 6:
      variant = "traditional_elves";
      break;
    case roll <= 0.14 * 7:
      variant = "two_hairs_elves";
      break;
    default:
  }

  return {
    trait_type: "hat",
    value: variant
  };
}
