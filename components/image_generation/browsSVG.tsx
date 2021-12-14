import RND from "./randomizer";
import { Trait } from "./common";

export const browsPrefix = "6000_brows_";

export default function Brows(seed: number): Trait {
  const rnd = new RND(79182 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "bushy_black";
  switch (true) {
    case roll <= 0.15:
      variant = "black_saw_tooth";
      break;
    case roll <= 0.3:
      variant = "cotton_scraggly_white";
      break;
    case roll <= 0.45:
      variant = "curly_white";
      break;
    case roll <= 0.6:
      variant = "pointy_black";
      break;
    case roll <= 0.75:
      variant = "unibrow_black";
      break;
    case roll <= 0.9:
      variant = "unibrow_white";
      break;
    default:
  }

  return {
    trait_type: "brows",
    value: variant
  };
}
