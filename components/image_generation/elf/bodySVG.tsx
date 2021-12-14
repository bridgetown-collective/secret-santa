import RND from "../randomizer";
import { Trait } from '../common';

export const bodyPrefix = "2000_body_";

export default function Body(
  seed: number,
): Trait {
  const rnd = new RND(123122 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "8_bit_glitch";
  switch (true) {
    case roll <= 0.0909:
      variant = "reindeer_no_legs";
      break;
    case roll <= 0.1818:
      variant = "reindeer";
      break;
    case roll <= 0.2727:
      variant = "santa_belt";
      break;
    case roll <= 0.3636:
      variant = "santa_red_suspenders_no_shirt_nipples_hair";
      break;
    case roll <= 0.4545:
      variant = "santa_red_suspenders_no_shirt_nipples";
      break;
    case roll <= 0.5454:
      variant = "santa_red_suspenders_no_shirt";
      break;
    case roll <= 0.6363:
      variant = "santa_red_suspenders";
      break;
    case roll <= 0.7272:
      variant = "sweater_diamond_black_belt";
      break;
    case roll <= 0.8181:
      variant = "sweater_diamond_ornament_belt";
      break;
    case roll <= 0.9090:
      variant = "undershirt";
      break;
    default:
  }

  return {
    trait_type: "body",
    value: variant,
  }
}
