import styled, { css } from "styled-components";
import { ReactSVG } from "react-svg";
import RND from "./randomizer";

const HeadComponent = styled(props => {
  const roll = props.rnd.rb(0, 1);

  let variant = "blue_elf_ears";
  switch (true) {
    case roll <= 0.1:
      variant = "blue_round_ears";
      break;
    case roll <= 0.2:
      variant = "brown_elf_ears";
      break;
    case roll <= 0.3:
      variant = "brown_round_ears";
      break;
    case roll <= 0.45:
      variant = "peach_elf_ears";
      break;
    case roll <= 0.6:
      variant = "peach_round_ears";
      break;
    case roll <= 0.7:
      variant = "yellow_elf_ears";
      break;
    case roll <= 0.9:
      variant = "yellow_round_ears";
      break;
    default:
  }

  return (
    <ReactSVG
      src={`assets/raging-santas/3000_face_${variant}.svg`}
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

const HeadS = ({ seed }) => {
  const rnd = new RND(parseInt((104002 * seed).toString()));
  return <HeadComponent rnd={rnd} />;
};

const Head = HeadS;

export default Head;
