import RND from "./randomizer";
import { Trait } from "./common";

export const armsPrefix = "5100_arms_";

export default function Arms(seed: number): Trait {
  const rnd = new RND(9969498 * seed);
  let roll = rnd.rb(0, 1);
  let variant = "toothpicks";

  switch (true) {
    case roll <= 0.111:
      variant = "match_sticks";
      break;
    case roll <= 0.111 * 2:
      variant = "one_popsicle_stick";
      break;
    case roll <= 0.111 * 3:
      variant = "pipe_cleaners_red";
      break;
    case roll <= 0.111 * 4:
      variant = "popsicle_stick_split";
      break;
    case roll <= 0.111 * 5:
      variant = "q_tips";
      break;
    case roll <= 0.111 * 6:
      variant = "toothpicks_black";
      break;
    case roll <= 0.111 * 7:
      variant = "wood_sticks";
      break;
    case roll <= 0.111 * 8:
      variant = "candy_canes";
      break;
    default:
  }

  return {
    trait_type: "arms",
    value: variant
  };
}
