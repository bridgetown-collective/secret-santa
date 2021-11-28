import { getAssetMap } from "./common";

export default function Nose(
  seed: number,
  svgMap: Record<string, string>
): string {
  const noses = getAssetMap(svgMap, "9000_nose_", ["red_paper_texture"]);

  let variant = "red_paper_texture";
  switch (true) {
    default:
  }

  return noses[variant];
}
