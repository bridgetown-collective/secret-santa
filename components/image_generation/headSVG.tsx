import RND from "./randomizer";
import { Trait } from './common';

export const headPrefix = "3000_face_";

export default function Head(
  seed: number,
): Trait {
  const rnd = new RND(104002 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "blue_round_ears";
  switch (true) {
    case roll <= 0.5:
      variant = "yellowish_orange_elf_ears";
      break;
    default:
  }

  return {
    trait_type: "head",
    value: variant,
  }
}
