import { getAssetMap } from "./common";
import RND from "./randomizer";

export default function Head(
  seed: number,
  svgMap: Record<string, string>
): string {
  const heads = getAssetMap(svgMap, "3000_face_", [
    "blue_elf_ears",
    "blue_round_ears",
    "brown_elf_ears",
    "brown_round_ears",
    "peach_elf_ears",
    "peach_round_ears",
    "yellow_elf_ears",
    "yellow_round_ears",
  ]);

  const rnd = new RND(104002 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "blue_elf_ears";
  switch (true) {
    case roll <= 0.1:
      variant = "blue_round_ears";
      break;
    case roll <= 0.2:
      variant = "brown_elf_ears";
      break;
    case roll <= 0.3:
      variant = "brown_round_ears";
      break;
    case roll <= 0.45:
      variant = "peach_elf_ears";
      break;
    case roll <= 0.6:
      variant = "peach_round_ears";
      break;
    case roll <= 0.7:
      variant = "yellow_elf_ears";
      break;
    case roll <= 0.9:
      variant = "yellow_round_ears";
      break;
    default:
  }

  return heads[variant];
}
