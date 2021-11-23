import styled, { css } from "styled-components";
import { ReactSVG } from "react-svg";
import RND from "./randomizer";

const BodyComponent = styled(props => {
  const roll = props.rnd.rb(0,1) 

  let variant = "cardboard"
  switch (true) {
    case roll <= 0.1:
      variant = "sweater_camoflauge"
      break;
    case roll <= 0.2:
      variant = "santa_red_suspenders_no_shirt_nipples_hair"
      break;
    case roll <= 0.25:
      variant = "wreath_buttons"
      break;
    case roll <= 0.3:
      variant = "santa_belt"
      break;
    case roll <= 0.35:
      variant = "sweater_trees"
      break;
    case roll <= 0.4:
      variant = "santa_red_suspenders_no_shirt_nipples"
      break;
    case roll <= 0.5:
      variant = "sweater_trees"
      break;
    case roll <= 0.55:
      variant = "sweater_orange_hunting"
      break;
    case roll <= 0.6:
      variant = "santa_red_suspenders"
      break;
    case roll <= 0.65:
      variant = "sweater_diamond_ornament_belt"
      break;
    case roll <= 0.7:
      variant = "santa_red_suspenders_no_shirt"
      break;
    case roll <= 0.75:
      variant = "sweater_diamond"
      break;
    case roll <= 0.8:
      variant = "blue"
      break;
    case roll <= 0.85:
      variant = "sweater_chanukah"
      break;
    case roll <= 0.9:
      variant = "santa_red"
      break;
    default:
  }

  return (
    <ReactSVG
      src={`assets/2000_body_${variant}.svg`}
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

const BodyS = ({ seed }) => {
  const rnd = new RND(parseInt(123122 * seed));
  return (
    <>
      <BodyComponent rnd={rnd} />
    </>
  );
};

const Body = BodyS;

export default Body;
