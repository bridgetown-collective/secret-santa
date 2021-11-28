import { getAssetMap } from "./common";
import RND from "./randomizer";

export default function Brows(
  seed: number,
  svgMap: Record<string, string>
): string {
  const brows = getAssetMap(svgMap, "6000_brows_", [
    "bushy_black",
    "unibrow_white",
  ]);

  const rnd = new RND(79182 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "bushy_black";
  switch (true) {
    case roll <= 0.5:
      variant = "unibrow_white";
      break;
    default:
  }

  return brows[variant];
}
