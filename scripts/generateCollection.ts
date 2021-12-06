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

  fs.mkdir(folderName, (err) => {
    if (err) {
      throw err;
    }
    const svgMap = getSVGMap(fs, path);
    for (let i = 0; i < quantity; i++) {
      let svgPath = path.join(folderName, `${i}.svg`);
      const svgString = RagingSantaSVGString(i / 1000, svgMap);
      fs.writeFileSync(svgPath, svgString);

      let jsonPath = path.join(folderName, `${i}.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(RagingSantaTraits(i / 1000)));
      const inputBuffer = Buffer.from(svgString);
      let pngPath = path.join(folderName, `${i}.png`);
      sharp(inputBuffer).resize(500, 500).toFile(pngPath);
    }

    console.log("Directory is created.");
  });
}

if (quantity) {
  main(quantity);
} else {
  console.warn("No Quantity Provided. Script Ending");
}

export {};
