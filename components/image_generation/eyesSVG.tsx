import RND from "./randomizer";
import { Trait } from './common';

export const eyesPrefix = "5000_eyes_";

export default function Eyes(
  seed: number,
): Trait {

  const rnd = new RND(1576642 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "googly";
  switch (true) {
    case roll <= 0.3:
      variant = "pacman";
      break;
    case roll <= 0.75:
      variant = "squinty_black";
      break;
    default:
  }

  return {
    trait_type: "eyes",
    value: variant,
  }
}
