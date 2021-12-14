import RND from "./randomizer";
import { Trait } from "./common";

export const beardPrefix = "7000_beard_";

export default function Beard(seed: number): Trait {
  const rnd = new RND(166382 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "traditional";
  switch (true) {
    case roll <= 0.01:
      variant = "8_bit";
      break;
    case roll <= 0.02:
      variant = "nutcracker";
      break;
    case roll <= 0.05:
      variant = "cotton_3_points_gray";
      break;
    case roll <= 0.08:
      variant = "icicles_white_and_gray";
      break;
    case roll <= 0.11:
      variant = "mutton_chops";
      break;
    case roll <= 0.14:
      variant = "scraggly_white";
      break;
    case roll <= 0.18:
      variant = "cotton";
      break;
    case roll <= 0.22:
      variant = "lines_white";
      break;
    case roll <= 0.26:
      variant = "falling_off_with_stubble";
      break;
    case roll <= 0.31:
      variant = "biker_moustache";
      break;
    case roll <= 0.36:
      variant = "chin_curtain";
      break;
    case roll <= 0.42:
      variant = "goatee";
      break;
    case roll <= 0.48:
      variant = "green_bow";
      break;
    case roll <= 0.54:
      variant = "no_beard_red_cheeks";
      break;
    case roll <= 0.61:
      variant = "chin_curtain_with_stubble";
      break;
    case roll <= 0.68:
      variant = "falling_off_no_stubble";
      break;
    case roll <= 0.75:
      variant = "paper_plate";
      break;
    case roll <= 0.82:
      variant = "white_string_thick";
      break;
    case roll <= 0.90:
      variant = "stubble_gray";
      break;
    default:
  }

  console.log("beard", variant);
  return {
    trait_type: "beard",
    value: variant
  };
}
