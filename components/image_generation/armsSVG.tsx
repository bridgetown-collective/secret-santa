import { getAssetMap } from "./common";
import RND from "./randomizer";

export default function Arms(
  seed: number,
  svgMap: Record<string, string>
): string {
  const arms = getAssetMap(svgMap, "5100_arms_", ["black", "popsicle_sticks"]);

  const rnd = new RND(150992 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "black";
  switch (true) {
    case roll <= 0.5:
      variant = "popsicle_sticks";
      break;
    default:
  }

  return arms[variant];
}
