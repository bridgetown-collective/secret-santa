import styled, { css } from "styled-components";
import { ReactSVG } from "react-svg";
import RND from "./randomizer";

const BackgroundComponent = styled((props) => {
  const roll = props.rnd.rb(0, 1);

  let color = "baby_blue";
  switch (true) {
    case roll < 0.333:
      color = "green";
      break;
    case roll < 0.666:
      color = "pink";
      break;
    default:
  }

  return (
    <>
      <ReactSVG
        src={`assets/raging-santas/1000_background_${color}.svg`}
        renumerateIRIElements={false}
        {...props}
      />
    </>
  );
})`
  position: absolute;
  left: 0;
  top: 0;

  svg {
    height: 478px;
  }
`;

const BackgroundS = ({ seed }) => {
  const rnd = new RND(parseInt((142442 * seed).toString()));
  return (
    <>
      <BackgroundComponent rnd={rnd} />
    </>
  );
};

const Background = BackgroundS;

export default Background;
