import { getAssetMap } from "./common";
import RND from "./randomizer";

export default function Body(
  seed: number,
  svgMap: Record<string, string>
): string {
  const backgrounds = getAssetMap(svgMap, "1000_background_", [
    "baby_blue",
    "green",
    "pink",
  ]);

  const rnd = new RND(142442 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "baby_blue";
  switch (true) {
    case roll < 0.333:
      variant = "green";
      break;
    case roll < 0.666:
      variant = "pink";
      break;
    default:
  }

  return backgrounds[variant];
}
