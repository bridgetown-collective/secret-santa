import RND from "../randomizer";
import { Trait } from "../common";

export const eyesPrefix = "5000_eyes_";

export default function Eyes(seed: number): Trait {
  const rnd = new RND(1390576642 * seed);
  const roll = rnd.rb(0, 1);
  let variant = "dots";

  switch (true) {
    case roll <= 0.3:
      variant = "googly";
      break;
    case roll <= 0.3:
      variant = "mixed";
      break;
    case roll <= 0.3:
      variant = "mixed_wink";
      break;
    case roll <= 0.3:
      variant = "pacman_with_whites";
      break;

    default:
  }

  return {
    trait_type: "eyes",
    value: variant
  };
}
