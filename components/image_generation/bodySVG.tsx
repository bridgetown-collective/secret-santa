import RND from "./randomizer";
import { Trait } from "./common";

export const bodyPrefix = "2000_body_";

export default function Body(seed: number): Trait {
  const rnd = new RND(123122 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "sweater_trees";
  switch (true) {
    case roll <= 0.01 * 1:
      variant = "8_bit_glitch";
      break;
    case roll <= 0.01 * 2:
      variant = "reindeer";
      break;
    case roll <= 0.01 * 3:
      variant = "sweater_diamond_ornament_belt";
      break;
    case roll <= 0.01 * 4:
      variant = "blue_robe";
      break;
    case roll <= 0.01 * 5:
      variant = "briefs_undershirt";
      break;
    case roll <= 0.01 * 6:
      variant = "sweater_chanukah";
      break;
    case roll <= 0.01 * 7:
      variant = "tp_torn";
      break;
    case roll <= 0.07 + 0.03 * 1:
      variant = "reindeer_no_legs";
      break;
    case roll <= 0.07 + 0.03 * 2:
      variant = "santa_red_suspenders_no_shirt_nipples_hair";
      break;
    case roll <= 0.07 + 0.03 * 3:
      variant = "sweater_diamond_black_belt";
      break;
    case roll <= 0.07 + 0.03 * 4:
      variant = "undershirt";
      break;
    case roll <= 0.07 + 0.03 * 5:
      variant = "angel";
      break;
    case roll <= 0.07 + 0.03 * 6:
      variant = "bow";
      break;
    case roll <= 0.07 + 0.03 * 7:
      variant = "cardboard_snowflake";
      break;
    case roll <= 0.07 + 0.03 * 8:
      variant = "orange_plaid";
      break;
    case roll <= 0.07 + 0.03 * 9:
      variant = "penguin";
      break;
    case roll <= 0.07 + 0.03 * 10:
      variant = "red_plaid";
      break;
    case roll <= 0.07 + 0.03 * 11:
      variant = "snowman";
      break;
    case roll <= 0.07 + 0.03 * 12:
      variant = "sweater_orange_hunting";
      break;
    case roll <= 0.07 + 0.03 * 13:
      variant = "swimsuit";
      break;
    case roll <= 0.07 + 0.03 * 14:
      variant = "tree";
      break;
    case roll <= 0.07 + 0.03 * 15:
      variant = "wreath_buttons";
      break;
    case roll <= 0.52 + 0.06 * 1:
      variant = "santa_belt";
      break;
    case roll <= 0.52 + 0.06 * 2:
      variant = "santa_red_suspenders_no_shirt_nipples";
      break;
    case roll <= 0.52 + 0.06 * 3:
      variant = "santa_red_suspenders_no_shirt";
      break;
    case roll <= 0.52 + 0.06 * 4:
      variant = "santa_red_suspenders";
      break;
    case roll <= 0.52 + 0.06 * 5:
      variant = "blue";
      break;
    case roll <= 0.52 + 0.06 * 6:
      variant = "cardboard";
      break;
    case roll <= 0.52 + 0.06 * 7:
      variant = "santa_red";
      break;
    default:
  }

  return {
    trait_type: "body",
    value: variant
  };
}
