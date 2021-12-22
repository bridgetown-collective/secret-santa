import RND from "./randomizer";
import { Trait } from "./common";

export const hatPrefix = "4000_hat_";

export default function Hat(seed: number): Trait {
  const rnd = new RND(1222242 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "traditional";
  switch (true) {
    case roll <= 0.02:
      variant = "camo_8_bit";
      break;
    case roll <= 0.02 + 0.03 * 1:
      variant = "8_bit_face";
      break;
    case roll <= 0.02 + 0.03 * 2:
      variant = "burglar_mask_purple";
      break;
    case roll <= 0.02 + 0.03 * 3:
      variant = "reindeer_hand_horns_half_mask";
      break;
    case roll <= 0.02 + 0.03 * 4:
      variant = "reindeer_horns_half_mask";
      break;
    case roll <= 0.02 + 0.03 * 5:
      variant = "ushanka_gingerbread_wreath";
      break;
    case roll <= 0.02 + 0.03 * 6:
      variant = "viking";
      break;
    case roll <= 0.02 + 0.03 * 7:
      variant = "halo";
      break;
    case roll <= 0.02 + 0.03 * 8:
      variant = "male_pattern_baldness_sides_and_top";
      break;
    case roll <= 0.02 + 0.03 * 9:
      variant = "male_pattern_baldness_sides";
      break;
    case roll <= 0.02 + 0.03 * 10:
      variant = "white_hair_helmet";
      break;

    case roll <= 0.32 + 0.04:
      variant = "red_fez";
      break;
    case roll <= 0.32 + 0.04 * 2:
      variant = "top_hat";
      break;
    case roll <= 0.32 + 0.04 * 3:
      variant = "camoflauge";
      break;
    case roll <= 0.32 + 0.04 * 4:
      variant = "devil_horns";
      break;

    case roll <= 0.48 + 0.05:
      variant = "energy_dome";
      break;
    case roll <= 0.48 + 0.05 * 2:
      variant = "green_elf";
      break;
    case roll <= 0.48 + 0.05 * 3:
      variant = "hunting";
      break;
    case roll <= 0.48 + 0.05 * 4:
      variant = "red_triangle";
      break;
    case roll <= 0.48 + 0.05 * 5:
      variant = "reindeer_horns";
      break;
    case roll <= 0.48 + 0.05 * 6:
      variant = "reindeer_no_horns";
      break;
    case roll <= 0.48 + 0.05 * 7:
      variant = "two_hairs";
      break;
    case roll <= 0.48 + 0.05 * 8:
      variant = "burglar_mask";
      break;
    case roll <= 0.48 + 0.05 * 9:
      variant = "jester";
      break;

    default:
  }

  return {
    trait_type: "hat",
    value: variant
  };
}
