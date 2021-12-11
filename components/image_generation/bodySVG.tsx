import RND from "./randomizer";
import { Trait } from './common';

export const bodyPrefix = "2000_body_";

export default function Body(
  seed: number,
): Trait {
  const rnd = new RND(123122 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "cardboard_snowflake";
  switch (true) {
    case roll <= 0.5:
      variant = "sweater_chanukah";
      break;
    default:
  }

  return {
    trait_type: "body",
    value: variant,
  }
}
