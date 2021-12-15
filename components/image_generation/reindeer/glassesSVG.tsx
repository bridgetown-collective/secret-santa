import { Trait } from './common';

export const glassesPrefix = "8100_glasses_";

export default function Glasses(
  seed: number,
): Trait {

  return {
    trait_type: "glasses",
    value: 'wire_square',
  }
}
