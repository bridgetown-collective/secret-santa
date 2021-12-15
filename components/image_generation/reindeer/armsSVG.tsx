import RND from "../randomizer";
import { Trait } from "../common";

export const armsPrefix = "5100_arms_";

export default function Arms(seed: number): Trait {
  const rnd = new RND(22097969498 * seed);
  let roll = rnd.rb(0, 1);
  let variant = "4_match_sticks_reindeer";

  switch (true) {
    case roll <= 0.1428 * 1:
      variant = "4_pipe_cleaners_red_reindeer";
      break;
    case roll <= 0.1428 * 2:
      variant = "4_popsicle_stick_split_reindeer";
      break;
    case roll <= 0.1428 * 3:
      variant = "4_q_tips_reindeer";
      break;
    case roll <= 0.1428 * 4:
      variant = "4_wood_sticks_reindeer";
      break;
    case roll <= 0.1428 * 5:
      variant = "4_penguin_flippers";
      break;
    case roll <= 0.1428 * 6:
      variant = "4_reindeer";
      break;

    default:
  }

  return {
    trait_type: "arms",
    value: variant
  };
}
