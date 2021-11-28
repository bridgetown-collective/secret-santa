export function getSVGMap(fs, path): Record<string, string> {
  const pathMap: Record<string, string> = {};

  const assetPath = path.join(
    __dirname,
    __dirname.includes(".next") ? ".." : "",
    "../../public/assets/raging-santas"
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
