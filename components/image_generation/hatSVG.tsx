import { getAssetMap } from "./common";
import RND from "./randomizer";

export default function Hat(
  seed: number,
  svgMap: Record<string, string>
): string {
  const hats = getAssetMap(svgMap, "4000_hat_", [
    "camoflauge",
    "bald",
    "burglar_mask",
    "cardboard_core",
    "cardboard_core_burglar_mask",
    "ushanka_gingerbread_wreath",
    "cardboard_core_devil_horns",
    "cardboard_core_hand_horns",
    "cardboard_core_reindeer_horns",
    "two_hairs",
    "traditional",
    "devil_horns",
    "energy_dome",
    "reindeer_horns_half_mask",
    "hunting",
    "jester",
    "mohawk",
    "red_fez",
    "red_triangle",
    "reindeer_hand_horns_half_mask",
    "reindeer_horns",
  ]);

  const rnd = new RND(1222242 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "camoflauge";
  switch (true) {
    case roll <= 0.1:
      variant = "bald";
      break;
    case roll <= 0.2:
      variant = "burglar_mask";
      break;
    case roll <= 0.25:
      variant = "cardboard_core";
      break;
    case roll <= 0.3:
      variant = "cardboard_core_burglar_mask";
      break;
    case roll <= 0.33:
      variant = "ushanka_gingerbread_wreath";
      break;
    case roll <= 0.35:
      variant = "cardboard_core_devil_horns";
      break;
    case roll <= 0.4:
      variant = "cardboard_core_hand_horns";
      break;
    case roll <= 0.45:
      variant = "cardboard_core_reindeer_horns";
      break;
    case roll <= 0.48:
      variant = "two_hairs";
      break;
    case roll <= 0.53:
      variant = "traditional";
      break;
    case roll <= 0.55:
      variant = "devil_horns";
      break;
    case roll <= 0.6:
      variant = "energy_dome";
      break;
    case roll <= 0.63:
      variant = "reindeer_horns_half_mask";
      break;
    case roll <= 0.65:
      variant = "hunting";
      break;
    case roll <= 0.7:
      variant = "jester";
      break;
    case roll <= 0.75:
      variant = "mohawk";
      break;
    case roll <= 0.8:
      variant = "red_fez";
      break;
    case roll <= 0.85:
      variant = "red_triangle";
      break;
    case roll <= 0.9:
      variant = "reindeer_hand_horns_half_mask";
      break;
    case roll <= 0.95:
      variant = "reindeer_horns";
      break;
    default:
  }

  return hats[variant];
}
