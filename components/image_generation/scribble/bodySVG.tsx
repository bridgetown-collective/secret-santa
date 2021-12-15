import RND from "../randomizer";
import { Trait } from "../common";

export const bodyPrefix = "2000_body_";

export default function Body(seed: number): Trait {
  const rnd = new RND(10023122 * seed);
  const roll = rnd.rb(0, 1);

  let variant = "rainbow_scrib";
  switch (true) {
    case roll <= 0.3333:
      variant = "santa_belt_scrib";
      break;
    case roll <= 0.6666:
      variant = "sweater_camoflauge_scrib";
      break;
    default:
  }

  return {
    trait_type: "body",
    value: variant
  };
}
