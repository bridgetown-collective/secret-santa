import RND from "./randomizer";
import { Trait } from "./common";

export const armsPrefix = "5100_arms_";

export default function Arms(seed: number): Trait {
  const rnd = new RND(9969498 * seed);
  let roll = rnd.rb(0, 1);
  let variant = "toothpicks";

  switch (true) {
    case roll <= 0.125:
      variant = "match_sticks";
      break;
    case roll <= 0.125 * 2:
      variant = "one_popsicle_stick";
      break;
    case roll <= 0.125 * 3:
      variant = "pipe_cleaners_red";
      break;
    case roll <= 0.125 * 4:
      variant = "popsicle_stick_split";
      break;
    case roll <= 0.125 * 5:
      variant = "q_tips";
      break;
    case roll <= 0.125 * 6:
      variant = "toothpicks_black";
      break;
    case roll <= 0.125 * 7:
      variant = "wood_sticks";
      break;

    default:
  }

  return {
    trait_type: "arms",
    value: variant
  };
}
