import RND from "./randomizer";
import { Trait } from "./common";

export const headPrefix = "3000_face_";

export default function Head(seed: number): Trait {
  const rnd = new RND(104002 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "blue_elf_ears";
  switch (true) {
    case roll <= 0.1:
      variant = "blue_round_ears";
      break;
    case roll <= 0.2:
      variant = "brown_elf_ears";
      break;
    case roll <= 0.3:
      variant = "brown_round_ears";
      break;
    case roll <= 0.4:
      variant = "cardboard_no_ears";
      break;
    case roll <= 0.5:
      variant = "cardboard_green_no_ears";
      break;
    case roll <= 0.6:
      variant = "peach_elf_ears";
      break;
    case roll <= 0.7:
      variant = "peach_round_ears";
      break;
    case roll <= 0.8:
      variant = "yellow_elf_ears";
      break;
    case roll <= 0.9:
      variant = "yellow_round_ears";
      break;
    default:
  }

  return {
    trait_type: "head",
    value: variant
  };
}
