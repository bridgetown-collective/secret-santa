import styled from "styled-components";
import { ReactSVG } from "react-svg";
import RND from "./randomizer";

const ArmsComponent = styled(props => {
  const roll = props.rnd.rb(0, 1);

  let variant = "black";
  switch (true) {
    case roll <= 0.5:
      variant = "popsicle_sticks";
      break;
    default:
  }

  return (
    <ReactSVG
      src={`assets/raging-santas/5100_Arms_${variant}.svg`}
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

const ArmsS = ({ seed }) => {
  const rnd = new RND(parseInt((150992 * seed).toString()));
  return <ArmsComponent rnd={rnd} />;
};

const Arms = ArmsS;

export default Arms;
