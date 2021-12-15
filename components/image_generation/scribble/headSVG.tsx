import RND from "../randomizer";
import { Trait } from "../common";

export const headPrefix = "3000_face_";

export default function Head(seed: number): Trait {
  const rnd = new RND(9054804002 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "blue_elf_ears_scrib";
  switch (true) {
    case roll <= 0.33333:
      variant = "blue_no_ears_scrib";
      break;
    case roll <= 0.666:
      variant = "peach_round_ears_scrib";
      break;

    default:
  }

  return {
    trait_type: "head",
    value: variant
  };
}
