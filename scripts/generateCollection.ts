import fs from "fs";
import path from "path";
import { Command } from "commander";
import sharp from "sharp";
import crypto from "crypto";

import { getSVGMap } from "../components/image_generation/common";
import {
  RagingSantaSVGString,
  RagingSantaTraits,
} from "../components/image_generation/svg-sketch";

const program = new Command();
program.option("-q, --quantity <quantity>", "number to generate");

program.parse(process.argv);

function genHash(input: string): string {
  return crypto
    .createHash('sha256')
    .update(input)
    .digest('hex');
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

  fs.mkdir(folderName, async (err) => {
    if (err) {
      throw err;
    }
    const svgMap = getSVGMap(fs, path);
    for (let i = 0; i < quantity; i++) {
      let seed = 709 * i + 1;
      const svgString = RagingSantaSVGString(seed, svgMap);
      let jsonPath = path.join(folderName, `${i}.json`);
      let pngPath = path.join(folderName, `${i}.png`);
      let traits = RagingSantaTraits(seed);

      for(let x = 0; x < traits.length; x++) {
        const {trait_type, value} = traits[x];
        if(!mapCounts[trait_type]) {
          mapCounts[trait_type] = {}
        }
        if(!mapCounts[trait_type][value]) {
          mapCounts[trait_type][value] = 0
        }
        mapCounts[trait_type][value]++;
      }
      let jsonStr= JSON.stringify(traits);
      fs.writeFileSync(jsonPath, jsonStr);
      let hashToCheck = genHash(jsonStr)

      if(!!uniqueCheck[hashToCheck]) {
        // Collision! Need to log it!
        collisions.push({
          hash: hashToCheck,
          traits: traits,
          seed: seed,
          matchedSeed: uniqueCheck[hashToCheck],
        }); 
      } else {
        uniqueCheck[hashToCheck] = seed;
      }

      const inputBuffer = Buffer.from(svgString);
      await sharp(inputBuffer, {density: 400}).resize(500, 500).toFile(pngPath);
    }

    let countPath = path.join(folderName, 'count.json');
    fs.writeFileSync(countPath, JSON.stringify({traits: mapCounts, collisions}));
    console.log("Directory is created.");
  });
}

if (quantity) {
  main(quantity);
} else {
  console.warn("No Quantity Provided. Script Ending");
}

export {};
