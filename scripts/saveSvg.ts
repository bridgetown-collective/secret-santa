import React from "react";
import { renderToString } from "react-dom/server";
import fs from "fs";

import SvgSketch from "../components/image_generation/svg-sketch";

function renderToStringLol() {
  const sketch = React.createElement(SvgSketch, { seed: 0.825 });

  return renderToString(sketch);
}

fs.writeFileSync("out.svg", renderToStringLol());
