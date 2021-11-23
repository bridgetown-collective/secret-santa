import styled, { css } from "styled-components";
import { ReactSVG } from "react-svg";
import RND from "./randomizer";

const EyesComponent = styled(props => {
  const roll = props.rnd.rb(0,1) 

  let variant = "dots"
  switch (true) {
    case roll <= 0.15:
      variant = "mixed"
      break;
    case roll <= 0.30:
      variant = "pacman"
      break;
    case roll <= 0.45:
      variant = "black"
      break;
    case roll <= 0.53:
      variant = "wreaths"
      break;
    case roll <= 0.60:
      variant = "black_white_inside"
      break;
    case roll <= 0.75:
      variant = "squinty_black"
      break;
    case roll <= 0.90:
      variant = "squinty_gingerbread_man"
      break;
    case roll <= 0.95:
      variant = "squinty_red"
      break;
    default:
  }

  return (
    <ReactSVG
      src={`assets/5000_eyes_${variant}.svg`}
      renumerateIRIElements={false}
      {...props}
    />
  );
})`
  position:absolute;
  left: 0;
  top: 0;

  svg {
    height: 478px;
  }
`;

const EyesS = ({ seed }) => {
  const rnd = new RND(parseInt(1576642 * seed));
  return (
    <>
      <EyesComponent rnd={rnd} />
    </>
  );
};

const Eyes = EyesS;

export default Eyes;
