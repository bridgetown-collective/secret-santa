import RND from "../randomizer";
import { Trait } from "../common";

export const headPrefix = "3000_face_";

export default function Head(seed: number): Trait {
  const rnd = new RND(104002 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "brown_elf_ears_elves";
  switch (true) {
    case roll <= 0.3:
      variant = "peach_elf_ears_elves";
      break;
    case roll <= 0.6:
      variant = "yellow_elf_ears_elves";
      break;
    default:
  }

  return {
    trait_type: "head",
    value: variant
  };
}
