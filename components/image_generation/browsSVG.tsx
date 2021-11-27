import styled, { css } from "styled-components";
import { ReactSVG } from "react-svg";
import RND from "./randomizer";

const BrowsComponent = styled((props) => {
  const roll = props.rnd.rb(0, 1);

  let variant = "bushy_black";
  switch (true) {
    case roll <= 0.5:
      variant = "unibrow_white";
      break;
    default:
  }

  return (
    <ReactSVG
      src={`assets/raging-santas/6000_brows_${variant}.svg`}
      renumerateIRIElements={false}
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

const BrowsS = ({ seed }) => {
  const rnd = new RND(parseInt((79182 * seed).toString()));
  return (
    <>
      <BrowsComponent rnd={rnd} />
    </>
  );
};

const Brows = BrowsS;

export default Brows;
