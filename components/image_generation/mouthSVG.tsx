import { getAssetMap } from "./common";
import RND from "./randomizer";

export default function Mouth(
  seed: number,
  svgMap: Record<string, string>
): string {
  const mouths = getAssetMap(svgMap, "8000_mouth_", [
    "canine_teeth",
    "gold_teeth",
    "missing_teeth",
  ]);

  const rnd = new RND(97713 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "canine_teeth";
  switch (true) {
    case roll <= 0.333:
      variant = "gold_teeth";
      break;
    case roll <= 0.666:
      variant = "missing_teeth";
      break;
    default:
  }

  return mouths[variant];
}
