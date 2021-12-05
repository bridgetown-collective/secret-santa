import fs from "fs";
import path from "path";

import { getSVGMap } from "../components/image_generation/common";
import { RagingSantaSVGString } from "../components/image_generation/svg-sketch";

const MAX_SUPPLY = 100;


var ds = new Date()
var folderName = `${ds.getFullYear()}-${ds.getMonth()}-${ds.getDate()}-${ds.getHours()}-${ds.getMinutes()}-${ds.getSeconds()}`;

fs.mkdir(folderName, (err) => {
  if (err) {
      throw err;
  }
  const svgMap = getSVGMap(fs, path);
  for (let i = 0; i < MAX_SUPPLY; i++) {
    let svgPath = path.join(folderName, `${i}.svg`)
    fs.writeFileSync(svgPath, RagingSantaSVGString(i / 1000, svgMap));
  }

  console.log("Directory is created.");
});

export {}
