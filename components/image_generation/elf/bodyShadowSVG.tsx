import { Trait } from '../common';

export const bodyShadowPrefix = "1500_";

export default function BodyShadowElves(
  seed: number,
): Trait {
  return {
    trait_type: "bodyShadow",
    value: "all_body_shadow_elves",
  }
}
