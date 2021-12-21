import RND from "./randomizer";
import { Trait } from "./common";

export const glassesPrefix = "8100_glasses_";

export default function Glasses(seed: number): Trait {
  const rnd = new RND(97713 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "ski_goggles";
  switch (true) {
    case roll <= 0.20:
      variant = "3d";
      break;
    case roll <= 0.4:
      variant = "reading";
      break;
    case roll <= 0.6:
      variant = "wire_square";
      break;
    case roll <= 0.8:
      variant = "classic_sunglasses";
      break;
    default:
  }

  return {
    trait_type: "glasses",
    value: variant
  };
}
