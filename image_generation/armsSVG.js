import styled, { css } from "styled-components";
import { ReactSVG } from "react-svg";
import RND from "./randomizer";

const ArmsComponent = styled(props => {
  const roll = props.rnd.rb(0,1) 

  let variant = "black"
  switch (true) {
    case roll <= 0.5:
      variant = "popsicle_sticks"
      break;
    default:
  }

  console.log(variant, 'Arms')
  return (
    <ReactSVG
      src={`assets/5100_Arms_${variant}.svg`}
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

const ArmsS = ({ seed }) => {
  const rnd = new RND(parseInt(150992 * seed));
  return (
    <>
      <ArmsComponent rnd={rnd} />
    </>
  );
};

const Arms = ArmsS;

export default Arms;
