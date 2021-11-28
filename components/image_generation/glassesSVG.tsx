import { getAssetMap } from "./common";
import RND from "./randomizer";

export default function Glasses(
  seed: number,
  svgMap: Record<string, string>
): string {
  const glasses = getAssetMap(svgMap, "8100_glasses_", [
    "googly_eyes",
    "googly_eyes_different_size",
    "ski_goggles",
    "wire_square",
  ]);

  const rnd = new RND(150992 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "googly_eyes";
  switch (true) {
    case roll <= 0.2:
      variant = "googly_eyes_different_size";
      break;
    case roll <= 0.4:
      variant = "round_black_waldo_exotropia";
      break;
    case roll <= 0.6:
      variant = "ski_goggles";
      break;
    case roll <= 0.8:
      variant = "wire_square";
      break;
    default:
  }

  return glasses[variant];
}
