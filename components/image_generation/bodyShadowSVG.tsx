import RND from "./randomizer";
import { Trait } from './common';

export const bodyShadowPrefix = "1500_";

export default function BodyShadow(
  seed: number,
): Trait {
  return {
    trait_type: "bodyShadow",
    value: "all_body_shadow",
  }
}
