import { getAssetMap } from "./common";
import RND from "./randomizer";

export default function Beard(
  seed: number,
  svgMap: Record<string, string>
): string {
  const beards = getAssetMap(svgMap, "7000_beard_", [
    "green_bow",
    "traditional",
    "falling_off",
  ]);

  const rnd = new RND(166382 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "green_bow";
  switch (true) {
    case roll <= 0.5:
      variant = "traditional";
      break;
    case roll <= 0.8:
      variant = "falling_off";
      break;
    default:
  }

  return beards[variant];
}
