import RND from "../randomizer";
import { Trait } from "../common";

export const bodyPrefix = "2000_body_";

export default function Body(seed: number): Trait {
  const rnd = new RND(16423122 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "angel_reindeer";
  switch (true) {
    case roll <= 0.0714 * 1:
      variant = "penguin_reindeer";
      break;
    case roll <= 0.0714 * 2:
      variant = "reindeer_no_legs_reindeer";
      break;
    case roll <= 0.0714 * 3:
      variant = "brown_reindeer";
      break;
    case roll <= 0.0714 * 4:
      variant = "blue";
      break;
    case roll <= 0.0714 * 5:
      variant = "cardboard";
      break;
    case roll <= 0.0714 * 6:
      variant = "sweater_diamond_ornament_belt";
      break;
    case roll <= 0.0714 * 7:
      variant = "orange_plaid";
      break;
    case roll <= 0.0714 * 8:
      variant = "red_plaid";
      break;
    case roll <= 0.0714 * 9:
      variant = "santa_belt";
      break;
    case roll <= 0.0714 * 10:
      variant = "santa_red";
      break;
    case roll <= 0.0714 * 11:
      variant = "sweater_chanukah";
      break;
    case roll <= 0.0714 * 12:
      variant = "sweater_diamond_black_belt";
      break;
    case roll <= 0.0714 * 13:
      variant = "sweater_orange_hunting";
      break;

    default:
  }

  return {
    trait_type: "body",
    value: variant
  };
}
