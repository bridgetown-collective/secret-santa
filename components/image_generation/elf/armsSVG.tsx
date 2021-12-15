import RND from "../randomizer";
import { Trait } from "../common";

export const armsPrefix = "5100_arms_";

export default function Arms(seed: number): Trait {
  const rnd = new RND(9969498 * seed);
  let roll = rnd.rb(0, 1);

  let variant = "match_sticks_elves";
  switch (true) {
    case roll <= 0.3333:
      variant = "pipe_cleaners_red_elves";
      break;
    case roll <= 0.6666:
      variant = "popsicle_stick_split_elves";
      break;

    default:
  }

  return {
    trait_type: "arms",
    value: variant
  };
}
