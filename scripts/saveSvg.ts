import React from "react"
import ReactDOM from 'react-dom'
import { renderToString } from 'react-dom/server'
import SvgSketch from "../components/image_generation/svg-sketch";
const fs = require('fs');

function renderToStringLol () {
  const sketch = React.createElement(SvgSketch, {seed: 0.825})
  ReactDOM.hydrate(sketch)

  return renderToString(sketch)
}

fs.writeFileSync('out.svg', renderToStringLol());
