import RND from "./randomizer";
import { Trait } from "./common";

export const eyesPrefix = "5000_eyes_";

export default function Eyes(seed: number): Trait {
  const rnd = new RND(1576642 * seed);
  const roll = rnd.rb(0, 1);
  let variant = "bows";

  switch (true) {
    case roll <= 0.05:
      variant = "black_dots_no_white";
      break;
    case roll <= 0.1:
      variant = "black_white_inside";
      break;
    case roll <= 0.15:
      variant = "black";
      break;
    case roll <= 0.2:
      variant = "dots_bruised";
      break;
    case roll <= 0.25:
      variant = "dots_lines_bottom";
      break;
    case roll <= 0.3:
      variant = "dots";
      break;
    case roll <= 0.34:
      variant = "googly";
      break;
    case roll <= 0.38:
      variant = "mixed_slash";
      break;
    case roll <= 0.42:
      variant = "mixed_wink";
      break;
    case roll <= 0.46:
      variant = "mixed_x";
      break;
    case roll <= 0.5:
      variant = "mixed";
      break;
    case roll <= 0.54:
      variant = "x";
      break;
    case roll <= 0.58:
      variant = "yule_log";
      break;
    case roll <= 0.62:
      variant = "swirly";
      break;
    case roll <= 0.65:
      variant = "pacman_with_whites";
      break;
    case roll <= 0.7:
      variant = "pacman";
      break;
    case roll <= 0.75:
      variant = "squint";
      break;
    case roll <= 0.8:
      variant = "squinty_black";
      break;
    case roll <= 0.85:
      variant = "black_dots_no_white_bags";
      break;
    case roll <= 0.875:
      variant = "open_doodles";
      break;
    case roll <= 0.9:
      variant = "pacman_black_bags";
      break;
    case roll <= 0.925:
      variant = "squinty_gingerbread_man";
      break;
    case roll <= 0.95:
      variant = "squinty_red";
      break;
    case roll <= 0.975:
      variant = "black_gingerbread_man";
      break;
    default:
  }

  return {
    trait_type: "eyes",
    value: variant
  };
}
