import RND from "./randomizer";
import { Trait } from "./common";

export const bodyPrefix = "2000_body_";

export default function Body(seed: number): Trait {
  const rnd = new RND(123122 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "sweater_trees";
  switch (true) {
    case roll <= 0.005 * 1:
      variant = "8_bit_glitch";
      break;
    case roll <= 0.005 * 2:
      variant = "reindeer";
      break;
    case roll <= 0.005 * 3:
      variant = "briefs_undershirt";
      break;
    case roll <= 0.005 * 4:
      variant = "coal";
      break;
    case roll <= 0.02 + 0.01 * 1:
      variant = "sweater_diamond_ornament_belt";
      break;
    case roll <= 0.02 + 0.01 * 2:
      variant = "blue_robe";
      break;
    case roll <= 0.02 + 0.01 * 3:
      variant = "sweater_chanukah";
      break;
    case roll <= 0.02 + 0.01 * 4:
      variant = "tp_torn";
      break;
    case roll <= 0.02 + 0.01 * 5:
      variant = "swimsuit";
      break;
    case roll <= 0.02 + 0.01 * 6:
      variant = "sweater_orange_hunting";
      break;
    case roll <= 0.02 + 0.01 * 7:
      variant = "xmas_lights_black";
      break;
    case roll <= 0.02 + 0.01 * 8:
      variant = "stocking";
      break;
    case roll <= 0.02 + 0.01 * 9:
      variant = "sweater_camoflauge";
      break;

    case roll <= 0.11 + 0.02 * 1:
      variant = "popsicle_star_of_david";
      break;
    case roll <= 0.11 + 0.02 * 2:
      variant = "rainbow_gradient";
      break;
    case roll <= 0.11 + 0.02 * 3:
      variant = "sweater_diamond_black_belt";
      break;
    case roll <= 0.11 + 0.02 * 4:
      variant = "undershirt";
      break;
    case roll <= 0.11 + 0.02 * 5:
      variant = "bow";
      break;
    case roll <= 0.11 + 0.02 * 6:
      variant = "penguin";
      break;

    case roll <= 0.23 + 0.03 * 1:
      variant = "santa_red_suspenders_no_shirt_nipples_hair";
      break;
    case roll <= 0.23 + 0.03 * 2:
      variant = "reindeer_no_legs";
      break;
    case roll <= 0.23 + 0.03 * 3:
      variant = "angel";
      break;
    case roll <= 0.23 + 0.03 * 4:
      variant = "cardboard_snowflake";
      break;
    case roll <= 0.23 + 0.03 * 5:
      variant = "orange_plaid";
      break;
    case roll <= 0.23 + 0.03 * 6:
      variant = "red_plaid";
      break;
    case roll <= 0.23 + 0.03 * 7:
      variant = "snowman";
      break;
    case roll <= 0.23 + 0.03 * 8:
      variant = "tree";
      break;
    case roll <= 0.23 + 0.03 * 9:
      variant = "santa_red";
      break;
    case roll <= 0.23 + 0.03 * 10:
      variant = "santa_red_suspenders_no_shirt";
      break;
    case roll <= 0.23 + 0.03 * 11:
      variant = "hawaiian_shirt";
      break;
    case roll <= 0.23 + 0.03 * 12:
      variant = "briefs";
      break;
    case roll <= 0.23 + 0.03 * 13:
      variant = "xmas_lights_green";
      break;
    case roll <= 0.23 + 0.03 * 14:
      variant = "santa_red_suspenders";
      break;
    case roll <= 0.23 + 0.03 * 15:
      variant = "candy_cane_rainbow";
      break;
    case roll <= 0.23 + 0.03 * 16:
      variant = "candy_cane_red_white";
      break;

    case roll <= 0.71 + 0.04:
      variant = "blue";
      break;

    case roll <= 0.75 + 0.05 * 1:
      variant = "santa_belt";
      break;
    case roll <= 0.75 + 0.05 * 2:
      variant = "santa_red_suspenders_no_shirt_nipples";
      break;
    case roll <= 0.75 + 0.05 * 3:
      variant = "cardboard";
      break;
    case roll <= 0.75 + 0.05 * 4:
      variant = "wreath_buttons";
      break;
    default:
  }

  return {
    trait_type: "body",
    value: variant
  };
}
