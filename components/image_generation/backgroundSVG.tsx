import RND from "./randomizer";
import { Trait } from './common';

export const backgroundPrefix = "1000_background_";

export default function Background(
  seed: number
): Trait {
  const rnd = new RND(14242 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "forest_8_bit";
  switch (true) {
    case roll < 0.11:
      variant = "green_textured";
      break;
    case roll < 0.11 * 2:
      variant = "light_yellow";
      break;
    case roll < 0.11 * 3:
      variant = "yellow_no_texture";
      break;
    case roll < 0.11 * 4:
      variant = "pink_textured";
      break;
    case roll < 0.11 * 5:
      variant = "blue_textured";
      break;
    case roll < 0.65:
      variant = "orange_pink_no_texture";
      break;
    case roll < 0.65 + 0.07 * 1:
      variant = "rainbow";
      break;
    case roll < 0.65 + 0.07 * 2:
      variant = "snowflakes";
      break;
    case roll < 0.80 + 0.08 * 1:
      variant = "forest";
      break;
    case roll < 0.80 + 0.08 * 2:
      variant = "mountains";
      break;
    case roll < 0.966:
      variant = "camo_white_fill";
      break;
    case roll < 0.983:
      variant = "not_space_invaders";
      break;
    default:
  }

  return {
    trait_type: "background",
    value: variant,
  }
}
