export type TraitTypes = "arms" | "background" | "beard" | "body" | "bodyShadow" | "brows" | "eyes" | "glasses" | "hat" | "head" | "mouth" | "nose" ;
export type Trait = {trait_type: TraitTypes, value: string}

export function getSVGMap(fs, path): Record<string, string> {
  const pathMap: Record<string, string> = {};

  const assetPath = path.join(
    __dirname,
    __dirname.includes(".next") ? ".." : "",
    "../../public/assets/new-traits"
  );
  const files = fs.readdirSync(assetPath);

  for (const f of files) {
    pathMap[f] = fs.readFileSync(path.join(assetPath, f)).toString();
  }

  return pathMap;
}

export function getAssetMap(
  svgMap: Record<string, string>,
  prefix: string,
  names: string[]
): Record<string, string> {
  return names.reduce(
    (a, b) => ({ ...a, [b]: svgMap[`${prefix}${b}.svg`] }),
    {}
  );
}
