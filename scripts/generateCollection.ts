import fs from "fs";
import path from "path";
import { Command } from "commander";
import sharp from "sharp";
import crypto from "crypto";

import { getSVGMap } from "../components/image_generation/common";
import {
  RagingSantaSVGString,
  RagingSantaTraits
} from "../components/image_generation/svg-sketch";

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
    for (let i = 0; i < quantity; i++) {
      let seed = i;
      const svgString = RagingSantaSVGString(seed, svgMap);
      let jsonPath = path.join(folderName, `${i}.json`);
      let pngPath = path.join(folderName, `${i}.png`);
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
      fs.writeFileSync(jsonPath, JSON.stringify(metadata));
      console.log(imageProvHash);
      provenanceHashConcat += imageProvHash;
    }
    console.log("fullconcat", provenanceHashConcat);
    const provHash = genHash(provenanceHashConcat);
    console.log("provHash", provHash);
    let countPath = path.join(folderName, "count.json");
    fs.writeFileSync(
      countPath,
      JSON.stringify({
        traits: mapCounts,
        collisions,
        provenanceHash: provHash
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
