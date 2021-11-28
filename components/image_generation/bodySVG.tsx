import { getAssetMap } from "./common";
import RND from "./randomizer";

export default function Body(
  seed: number,
  svgMap: Record<string, string>
): string {
  const bodies = getAssetMap(svgMap, "2000_body_", [
    "cardboard",
    "sweater_camoflauge",
    "santa_red_suspenders_no_shirt_nipples_hair",
    "wreath_buttons",
    "santa_belt",
    "sweater_trees",
    "santa_red_suspenders_no_shirt_nipples",
    "sweater_orange_hunting",
    "santa_red_suspenders",
    "sweater_diamond_ornament_belt",
    "santa_red_suspenders_no_shirt",
    "sweater_diamond",
    "blue",
    "sweater_chanukah",
    "santa_red",
  ]);

  const rnd = new RND(123122 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "cardboard";
  switch (true) {
    case roll <= 0.1:
      variant = "sweater_camoflauge";
      break;
    case roll <= 0.2:
      variant = "santa_red_suspenders_no_shirt_nipples_hair";
      break;
    case roll <= 0.25:
      variant = "wreath_buttons";
      break;
    case roll <= 0.3:
      variant = "santa_belt";
      break;
    case roll <= 0.35:
      variant = "sweater_trees";
      break;
    case roll <= 0.4:
      variant = "santa_red_suspenders_no_shirt_nipples";
      break;
    case roll <= 0.5:
      variant = "sweater_trees";
      break;
    case roll <= 0.55:
      variant = "sweater_orange_hunting";
      break;
    case roll <= 0.6:
      variant = "santa_red_suspenders";
      break;
    case roll <= 0.65:
      variant = "sweater_diamond_ornament_belt";
      break;
    case roll <= 0.7:
      variant = "santa_red_suspenders_no_shirt";
      break;
    case roll <= 0.75:
      variant = "sweater_diamond";
      break;
    case roll <= 0.8:
      variant = "blue";
      break;
    case roll <= 0.85:
      variant = "sweater_chanukah";
      break;
    case roll <= 0.9:
      variant = "santa_red";
      break;
    default:
  }

  return bodies[variant];
}
