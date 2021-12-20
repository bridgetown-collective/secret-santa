import fs from "fs";
import path from "path";
import { Command } from "commander";
import sharp from "sharp";
import crypto from "crypto";

import generateProvenanceMatchHash from "./generateProvenanceMatchHash";
import { getSVGMap } from "../components/image_generation/common";
import {
  RagingSantaSVGString,
  RagingSantaTraits
} from "../components/image_generation/svg-sketch";

const fsPromises = fs.promises;
const program = new Command();
program.option("-q, --quantity <quantity>", "number to generate");

program.parse(process.argv);

function genHash(input: any): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

const { quantity } = program.opts();
function main(quantity: number): void {
  var ds = new Date();
  var folderName = `collection-${ds.getFullYear()}-${
    ds.getMonth() + 1
  }-${ds.getDate()}-${ds.getHours()}-${ds.getMinutes()}-${ds.getSeconds()}`;
  const mapCounts = {};
  const uniqueCheck = {};
  const collisions = [];

  fs.mkdir(folderName, async err => {
    if (err) {
      throw err;
    }
    const svgMap = getSVGMap(fs, path);
    let provenanceHashConcat = "";
    await fsPromises.mkdir(path.join(folderName, "prereveal"));
    await fsPromises.mkdir(path.join(folderName, "revealJSON"));
    await fsPromises.mkdir(path.join(folderName, "revealPNG"));
    let jsonPreRevealPath = path.join(folderName, "prereveal", `prereveal.json`);

    for (let i = 0; i < quantity; i++) {
      let seed = i;
      const svgString = RagingSantaSVGString(seed, svgMap);
      let jsonRevealPath = path.join(folderName, "revealJSON", `${i}.json`);
      let pngPath = path.join(folderName, "revealPNG", `${i}.png`);
      let traits = RagingSantaTraits(seed, false);
      let jsonStr = JSON.stringify(traits);

      for (let x = 0; x < traits.length; x++) {
        const { trait_type, value } = traits[x];
        if (!mapCounts[trait_type]) {
          mapCounts[trait_type] = {};
        }
        if (!mapCounts[trait_type][value]) {
          mapCounts[trait_type][value] = 0;
        }
        mapCounts[trait_type][value]++;
      }

      let hashToCheck = genHash(jsonStr);

      if (!!uniqueCheck[hashToCheck]) {
        // Collision! Need to log it!
        collisions.push({
          hash: hashToCheck,
          traits: traits,
          seed: seed,
          matchedSeed: uniqueCheck[hashToCheck]
        });
      } else {
        uniqueCheck[hashToCheck] = seed;
      }

      const inputBuffer = Buffer.from(svgString);
      const buffer = await sharp(inputBuffer, { density: 400 })
        .resize(500, 500)
        .toBuffer();
      fs.writeFileSync(pngPath, buffer);

      const imageProvHash = genHash(buffer);

      const metadata = {
        name: `Raging Santas #${i}`,
        description: `An On-Chain NFT Secret Santa Swap`,
        provenanceHash: imageProvHash,
        attributes: traits,
        image: `<someIPFSUrl>/${i}.png`
      };
      fs.writeFileSync(jsonRevealPath, JSON.stringify(metadata));
      console.log(`Processing Token ${i}`);
      console.log('imageHash', imageProvHash);
      provenanceHashConcat += imageProvHash;
    }

    const prerevealMetadata = {
      description: "an on-chain nft secret santa swap",
      image:
        "https://www.ragingsantas.xyz/assets/raging_santas_animated_preview.gif"
    };
    fs.writeFileSync(jsonPreRevealPath, JSON.stringify(prerevealMetadata));

    const provHash = genHash(provenanceHashConcat);
    const { seed: provMatchSeed, hash: provMatchHash } =
      generateProvenanceMatchHash();

    let summaryPath = path.join(folderName, "summary.json");
    fs.writeFileSync(
      summaryPath,
      JSON.stringify({
        traitCounts: mapCounts,
        collisions,
        provenanceImageHash: provHash,
        provenanceMatchSeed: provMatchSeed,
        provenanceMatchHash: provMatchHash
      })
    );
    console.log("Directory is created.");
  });
}

if (quantity) {
  main(quantity);
} else {
  console.warn("No Quantity Provided. Script Ending");
}

export {};
