import styled, { css } from "styled-components";
import { ReactSVG } from "react-svg";
import RND from "./randomizer";

const BeardComponent = styled(props => {
  const roll = props.rnd.rb(0,1) 

  let variant = "green_bow"
  switch (true) {
    case roll <= 0.5:
      variant = "traditional"
      break;
    case roll <= 0.8:
      variant = "falling_off"
      break;
    default:
  }

  return (
    <ReactSVG
      src={`assets/7000_beard_${variant}.svg`}
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

const BeardS = ({ seed }) => {
  const rnd = new RND(parseInt(166382 * seed));
  return (
    <>
      <BeardComponent rnd={rnd} />
    </>
  );
};

const Beard = BeardS;

export default Beard;
