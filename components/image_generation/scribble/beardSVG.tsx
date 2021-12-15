import RND from "../randomizer";
import { Trait } from "../common";

export const beardPrefix = "7000_beard_";

export default function Beard(seed: number): Trait {
  const rnd = new RND(1601826382 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "bow_scrib";
  switch (true) {
    case roll <= 0.25:
      variant = "cotton_3_points_gradient_scrib";
      break;
    case roll <= 0.5:
      variant = "cotton_3_points_white_scrib";
      break;
    case roll <= 0.75:
      variant = "cotton_scrib";
      break;
    default:
  }

  return {
    trait_type: "beard",
    value: variant
  };
}
