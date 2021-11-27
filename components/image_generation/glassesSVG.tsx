import styled from "styled-components";
import { ReactSVG } from "react-svg";
import RND from "./randomizer";

const GlassesComponent = styled((props) => {
  const roll = props.rnd.rb(0, 1);

  let variant = "googly_eyes";
  switch (true) {
    case roll <= 0.2:
      variant = "googly_eyes_different_size";
      break;
    case roll <= 0.4:
      variant = "round_black_waldo_exotropia";
      break;
    case roll <= 0.6:
      variant = "ski_goggles";
      break;
    case roll <= 0.8:
      variant = "wire_square";
      break;
    default:
  }

  return (
    <ReactSVG
      src={`assets/raging-santas/8100_glasses_${variant}.svg`}
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

const GlassesS = ({ seed }) => {
  const rnd = new RND(parseInt((150992 * seed).toString()));
  return <GlassesComponent rnd={rnd} />;
};

const Glasses = GlassesS;

export default Glasses;
