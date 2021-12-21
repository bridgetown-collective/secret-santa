import RND from "./randomizer";
import { Trait } from "./common";

export const beardPrefix = "7000_beard_";

export default function Beard(seed: number): Trait {
  const rnd = new RND(19966382 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "traditional";
  switch (true) {
    case roll <= 0.01:
      variant = "8_bit";
      break;
    case roll <= 0.01 * 2:
      variant = "nutcracker";
      break;
    case roll <= 0.02 + 0.03 * 1:
      variant = "cotton_3_points_gray";
      break;
    case roll <= 0.02 + 0.03 * 2:
      variant = "icicles_white_and_gray";
      break;
    case roll <= 0.02 + 0.03 * 3:
      variant = "mutton_chops";
      break;
    case roll <= 0.02 + 0.03 * 4:
      variant = "scraggly_white";
      break;
    case roll <= 0.02 + 0.03 * 5:
      variant = "goatee_circle";
      break;
    case roll <= 0.02 + 0.03 * 6:
      variant = "popsicle_sticks";
      break;
    case roll <= 0.02 + 0.03 * 7:
      variant = "super_long";
      break;
    case roll <= 0.23 + 0.04 * 1:
      variant = "cotton";
      break;
    case roll <= 0.23 + 0.04 * 2:
      variant = "lines_white";
      break;
    case roll <= 0.23 + 0.04 * 3:
      variant = "falling_off_with_stubble";
      break;
    case roll <= 0.35 + 0.05 * 1:
      variant = "biker_moustache";
      break;
    case roll <= 0.35 + 0.05 * 2:
      variant = "chin_curtain";
      break;
    case roll <= 0.35 + 0.05 * 3:
      variant = "falling_off_no_stubble";
      break;
    case roll <= 0.35 + 0.05 * 4:
      variant = "paper_plate";
      break;
    case roll <= 0.35 + 0.05 * 5:
      variant = "white_string_thick";
      break;
    case roll <= 0.6 + 0.06 * 1:
      variant = "goatee";
      break;
    case roll <= 0.6 + 0.06 * 2:
      variant = "green_bow";
      break;
    case roll <= 0.6 + 0.06 * 3:
      variant = "no_beard_red_cheeks";
      break;
    case roll <= 0.78 + 0.07:
      variant = "chin_curtain_with_stubble";
      break;
    case roll <= 0.78 + 0.07 * 2:
      variant = "stubble_gray";
      break;
    default:
  }

  return {
    trait_type: "beard",
    value: variant
  };
}
