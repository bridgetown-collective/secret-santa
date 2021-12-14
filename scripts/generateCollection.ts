import fs from "fs";
import path from "path";
import { Command } from "commander";
import sharp from "sharp";

import { getSVGMap } from "../components/image_generation/common";
import {
  RagingSantaSVGString,
  RagingSantaTraits,
} from "../components/image_generation/svg-sketch";

const program = new Command();
program.option("-q, --quantity <quantity>", "number to generate");

program.parse(process.argv);

const { quantity } = program.opts();
function main(quantity: number): void {
  var ds = new Date();
  var folderName = `collection-${ds.getFullYear()}-${
    ds.getMonth() + 1
  }-${ds.getDate()}-${ds.getHours()}-${ds.getMinutes()}-${ds.getSeconds()}`;
  const mapCounts = {};

  fs.mkdir(folderName, (err) => {
    if (err) {
      throw err;
    }
    const svgMap = getSVGMap(fs, path);
    for (let i = 0; i < quantity; i++) {
      const svgString = RagingSantaSVGString(i / 1000, svgMap);

      let jsonPath = path.join(folderName, `${i}.json`);
      let traits = RagingSantaTraits(i / 1000);
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
      fs.writeFileSync(jsonPath, JSON.stringify(traits));
      const inputBuffer = Buffer.from(svgString);
      let pngPath = path.join(folderName, `${i}.png`);
      sharp(inputBuffer, {density: 400}).resize(500, 500).toFile(pngPath);
    }


    let countPath = path.join(folderName, 'count.json');
    fs.writeFileSync(countPath, JSON.stringify(mapCounts));
    console.log("Directory is created.");
  });
}

if (quantity) {
  main(quantity);
} else {
  console.warn("No Quantity Provided. Script Ending");
}

export {};
