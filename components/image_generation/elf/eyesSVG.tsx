import RND from "../randomizer";
import { Trait } from "../common";

export const eyesPrefix = "5000_eyes_";

export default function Eyes(seed: number): Trait {
  const rnd = new RND(1576642 * seed);
  const roll = rnd.rb(0, 1);
  let variant = "black_dots_no_white_elves";
  switch (true) {
    default:
    case roll <= 0.0909 * 1:
      variant = "black_elves";
      break;
    case roll <= 0.0909 * 2:
      variant = "dots_elves";
      break;
    case roll <= 0.0909 * 3:
      variant = "googly_elves";
      break;
    case roll <= 0.0909 * 4:
      variant = "mixed_elves";
      break;
    case roll <= 0.0909 * 5:
      variant = "mixed_wink_elves";
      break;
    case roll <= 0.0909 * 6:
      variant = "open_scribbles_elves";
      break;
    case roll <= 0.0909 * 7:
      variant = "pacman_elves";
      break;
    case roll <= 0.0909 * 8:
      variant = "pacman_with_whites_elves";
      break;
    case roll <= 0.0909 * 9:
      variant = "yule_log_elves";
      break;
    case roll <= 0.0909 * 10:
      variant = "swirly_elves";
      break;
  }

  return {
    trait_type: "eyes",
    value: variant
  };
}
