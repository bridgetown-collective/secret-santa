import fs from "fs";
import path from "path";

import { getSVGMap } from "../components/image_generation/common";
import { RagingSantaSVGString } from "../components/image_generation/svg-sketch";

fs.writeFileSync("out.svg", RagingSantaSVGString(0.425, getSVGMap(fs, path)));
