import styled, { css } from "styled-components";
import { ReactSVG } from "react-svg";
import RND from "./randomizer";

const NoseComponent = styled(props => {
  const roll = props.rnd.rb(0, 1);

  let variant = "red_paper_texture";
  switch (true) {
    default:
  }

  return (
    <ReactSVG
      src={`assets/raging-santas/9000_nose_${variant}.svg`}
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

const NoseS = ({ seed }) => {
  const rnd = new RND(parseInt((703182 * seed).toString()));
  return <NoseComponent rnd={rnd} />;
};

const Nose = NoseS;

export default Nose;
