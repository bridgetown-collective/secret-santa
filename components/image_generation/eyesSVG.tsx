import RND from "./randomizer";
import { Trait } from "./common";

export const eyesPrefix = "5000_eyes_";

export default function Eyes(seed: number): Trait {
  const rnd = new RND(1576642 * seed);
  const roll = rnd.rb(0, 1);
  let variant = "squinty_black";

  switch (true) {
    case roll <= 0.025:
      variant = "black_gingerbread_man";
      break;
    case roll <= 0.025 * 2:
      variant = "bows";
      break;
    case roll <= 0.025 * 3:
      variant = "open_doodles";
      break;
    case roll <= 0.025 * 4:
      variant = "pacman_black_bags";
      break;
    case roll <= 0.025 * 5:
      variant = "squinty_gingerbread_man";
      break;
    case roll <= 0.025 * 6:
      variant = "squinty_red";
      break;

    case roll <= 0.15 + 0.03:
      variant = "pacman_with_whites";
      break;
    case roll <= 0.15 + 0.03 * 2:
      variant = "black_sunken";
      break;
    case roll <= 0.15 + 0.03 * 3:
      variant = "pacman";
      break;

    case roll <= 0.24 + 0.04:
      variant = "googly";
      break;
    case roll <= 0.24 + 0.04 * 2:
      variant = "mixed_slash";
      break;
    case roll <= 0.24 + 0.04 * 3:
      variant = "mixed_wink";
      break;
    case roll <= 0.24 + 0.04 * 4:
      variant = "mixed_x";
      break;
    case roll <= 0.24 + 0.04 * 5:
      variant = "mixed";
      break;
    case roll <= 0.24 + 0.04 * 6:
      variant = "x";
      break;
    case roll <= 0.24 + 0.04 * 7:
      variant = "yule_log";
      break;
    case roll <= 0.24 + 0.04 * 8:
      variant = "swirly";
      break;
    case roll <= 0.24 + 0.04 * 9:
      variant = "black_dots_no_white_bags";
      break;

    case roll <= 0.6 + 0.05:
      variant = "black_dots_no_white";
      break;
    case roll <= 0.6 + 0.05 * 2:
      variant = "black_white_inside";
      break;
    case roll <= 0.6 + 0.05 * 3:
      variant = "black";
      break;
    case roll <= 0.6 + 0.05 * 4:
      variant = "dots_bruised";
      break;
    case roll <= 0.6 + 0.05 * 5:
      variant = "dots_lines_bottom";
      break;
    case roll <= 0.6 + 0.05 * 6:
      variant = "dots";
      break;
    case roll <= 0.6 + 0.05 * 7:
      variant = "squint";
      break;
    default:
  }

  return {
    trait_type: "eyes",
    value: variant
  };
}
