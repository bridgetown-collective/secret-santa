import styled, { css } from "styled-components";
import { ReactSVG } from "react-svg";
import RND from "./randomizer";

const MouthComponent = styled(props => {
  const roll = props.rnd.rb(0, 1);

  let variant = "canine_teeth";
  switch (true) {
    case roll <= 0.333:
      variant = "gold_teeth";
      break;
    case roll <= 0.666:
      variant = "missing_teeth";
      break;
    default:
  }

  return (
    <ReactSVG
      src={`assets/raging-santas/8000_mouth_${variant}.svg`}
      renumerateIRIElements={false}
      wrapper="svg"
      {...props}
    />
  );
})`
  position: absolute;
  left: 0;
  top: 0;

  svg {
    height: 478px;
  }
`;

const MouthS = ({ seed }) => {
  const rnd = new RND(parseInt((97713 * seed).toString()));
  return <MouthComponent rnd={rnd} />;
};

const Mouth = MouthS;

export default Mouth;
