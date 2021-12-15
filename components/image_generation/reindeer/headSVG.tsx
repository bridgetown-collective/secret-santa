import { Trait } from "./common";

export const headPrefix = "3000_face_";

export default function Head(seed: number): Trait {
  return {
    trait_type: "head",
    value: "with_ears_reindeer"
  };
}
