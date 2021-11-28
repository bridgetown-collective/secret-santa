//import styled from "styled-components";
import RND from "./randomizer";
//import { renderToString } from "react-dom/server";

// Todo: would be great to dynamically load the svg after it's been determined
// @ts-ignore
import greenBackground from "../../public/assets/raging-santas/1000_background_green.svg";
// @ts-ignore
import blueBackground from "../../public/assets/raging-santas/1000_background_baby_blue.svg";
// @ts-ignore
import pinkBackground from "../../public/assets/raging-santas/1000_background_pink.svg";

const BackgroundComponent = props => {
  const roll = props.rnd.rb(0, 1);

  let color = blueBackground;
  switch (true) {
    case roll < 0.333:
      color = greenBackground;
      break;
    case roll < 0.666:
      color = pinkBackground;
      break;
    default:
  }

  // Want to return pure string but renderToString escapes the html stuff
  // return renderToString(color);
  return color;
}

const BackgroundS = ({ seed }) => {
  const rnd = new RND(parseInt((142442 * seed).toString()));
  return BackgroundComponent({rnd});
};

const Background = BackgroundS;

export default Background;
