import sharp from "sharp";
import path from "path";
import fs from "fs";
import { Command } from "commander";
const program = new Command();
program.option("-svg,--svg <pathSvg>", "svg path");
program.option("-png,--png <pathPng>", "png path");

program.parse(process.argv);

const { svg:pathSvg, png:pathPng } = program.opts();

function main(pathSvg, pathPng) {
  const svgString = fs.readFileSync(pathSvg);
  const inputBuffer = Buffer.from(svgString);
  sharp(inputBuffer).resize(500, 500).toFile(`${pathPng}.png`);
}

console.log(program.opts())
if (pathSvg && pathPng) {
  main(pathSvg, pathPng);
} else {
  console.warn("No Quantity Provided. Script Ending");
}

export {};
