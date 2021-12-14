import RND from "./randomizer";
import { Trait } from "./common";

export const hatPrefix = "4000_hat_";

export default function Hat(seed: number): Trait {
  const rnd = new RND(1222242 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "red_fez";
  switch (true) {
    case roll <= 0.065:
      variant = "camoflauge";
      break;
    case roll <= 0.13:
      variant = "devil_horns";
      break;
    case roll <= 0.195:
      variant = "energy_dome";
      break;
    case roll <= 0.26:
      variant = "green_elf";
      break;
    case roll <= 0.325:
      variant = "hunting";
      break;
    case roll <= 0.39:
      variant = "jester";
      break;
    case roll <= 0.455:
      variant = "red_triangle";
      break;
    case roll <= 0.52:
      variant = "reindeer_horns";
      break;
    case roll <= 0.585:
      variant = "reindeer_no_horns";
      break;
    case roll <= 0.65:
      variant = "traditional";
      break;
    case roll <= 0.715:
      variant = "two_hairs";
      break;
    case roll <= 0.78:
      variant = "burglar_mask";
      break;
    case roll <= 0.795:
      variant = "camo_8_bit";
      break;
    case roll <= 0.81:
      variant = "ushanka_gingerbread_wreath";
      break;
    case roll <= 0.84:
      variant = "viking";
      break;
    case roll <= 0.87:
      variant = "reindeer_horns_half_mask";
      break;
    case roll <= 0.9:
      variant = "reindeer_hand_horns_half_mask";
      break;
    case roll <= 0.93:
      variant = "8_bit_face";
      break;
    case roll <= 0.96:
      variant = "burglar_mask_purple";
      break;
    case roll <= 0.98:
      variant = "paper_towel_core";
      break;
    default:
  }

  return {
    trait_type: "hat",
    value: variant
  };
}
