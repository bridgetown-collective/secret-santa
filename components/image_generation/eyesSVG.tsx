import RND from "./randomizer";
import { Trait } from './common';

export const eyesPrefix = "5000_eyes_";

export default function Eyes(
  seed: number,
): Trait {

  const rnd = new RND(1576642 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "dots";
  switch (true) {
    case roll <= 0.15:
      variant = "mixed";
      break;
    case roll <= 0.3:
      variant = "pacman";
      break;
    case roll <= 0.45:
      variant = "black";
      break;
    case roll <= 0.53:
      variant = "wreaths";
      break;
    case roll <= 0.6:
      variant = "black_white_inside";
      break;
    case roll <= 0.75:
      variant = "squinty_black";
      break;
    case roll <= 0.9:
      variant = "squinty_gingerbread_man";
      break;
    case roll <= 0.95:
      variant = "squinty_red";
      break;
    default:
  }

  return {
    trait_type: "eyes",
    value: variant,
  }
}
