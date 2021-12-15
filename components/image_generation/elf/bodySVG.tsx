import RND from "../randomizer";
import { Trait } from "../common";

export const bodyPrefix = "2000_body_";

export default function Body(seed: number): Trait {
  const rnd = new RND(7123942 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "blue";
  switch (true) {
    case roll <= 0.0714 * 1:
      variant = "bow_elves";
      break;
    case roll <= 0.0714 * 2:
      variant = "cardboard";
      break;
    case roll <= 0.0714 * 3:
      variant = "penguin";
      break;
    case roll <= 0.0714 * 4:
      variant = "orange_plaid";
      break;
    case roll <= 0.0714 * 5:
      variant = "red_plaid";
      break;
    case roll <= 0.0714 * 6:
      variant = "reindeer_no_legs";
      break;
    case roll <= 0.0714 * 7:
      variant = "santa_belt";
      break;
    case roll <= 0.0714 * 8:
      variant = "santa_red";
      break;
    case roll <= 0.0714 * 10:
      variant = "sweater_chanukah";
      break;
    case roll <= 0.0714 * 11:
      variant = "sweater_diamond_black_belt";
      break;
    case roll <= 0.0714 * 12:
      variant = "sweater_diamond_ornament_belt";
      break;
    case roll <= 0.0714 * 13:
      variant = "sweater_orange_hunting";
      break;
    case roll <= 0.0714 * 14:
      variant = "sweater_trees";
      break;

    default:
  }

  return {
    trait_type: "body",
    value: variant
  };
}
