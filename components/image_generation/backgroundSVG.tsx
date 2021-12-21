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
    case roll < 0.22 + 0.10 * 1:
      variant = "yellow_no_texture";
      break;
    case roll < 0.22 + 0.10 * 2:
      variant = "pink_textured";
      break;
    case roll < 0.22 + 0.10 * 3:
      variant = "blue_textured";
      break;
    case roll < 0.22 + 0.10 * 4:
      variant = "orange_pink_no_texture";
      break;
    case roll < 0.62 + 0.08 * 1:
      variant = "snowflakes";
      break;
    case roll < 0.62 + 0.08 * 2:
      variant = "forest";
      break;
    case roll < 0.78 + 0.07 * 1:
      variant = "rainbow";
      break;
    case roll < 0.78 + 0.07 * 2:
      variant = "mountains";
      break;
    case roll < 0.92 + 0.0166:
      variant = "hell";
      break;
    case roll < 0.92 + 0.0166 * 2:
      variant = "stars_space";
      break;
    case roll < 0.92 + 0.0166 * 3:
      variant = "camo_white_fill";
      break;
    case roll < 0.92 + 0.0166 * 4:
      variant = "alien_8_bit";
      break;
    default:
  }

  return {
    trait_type: "background",
    value: variant,
  }
}
