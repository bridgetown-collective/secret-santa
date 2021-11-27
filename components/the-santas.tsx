import SvgSketch from "../components/image_generation/svg-sketch";
import "styled-jsx";

const THE_TEAM: Record<string, { bio: string; seed: number }> = {
  "@dr zarkov": {
    bio: "Some bio",
    seed: 0.15,
  },
  "@elbrocko": {
    bio: "Some bio",
    seed: 0.187,
  },
  "@m3p": {
    bio: "Some bio",
    seed: 0.82,
  },
  "@r0mille": {
    bio: "Some bio",
    seed: 0.4,
  },
};

const SCALE = 0.4;

export default function TheSantas() {
  return (
    <div id="the-santas" className="flex flex-col">
      <p className="text-4xl">The Santas</p>

      <div className="flex flex-wrap justify-center">
        {Object.entries(THE_TEAM).map(([handle, { bio, seed }]) => (
          <div key={handle} className="a-santa inline-block m-4">
            <div className="inline-block">
              <SvgSketch seed={seed} />
            </div>
            <h3>{handle}</h3>
            <p>{bio}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .a-santa {
          width: calc(480px * ${SCALE});
        }
        .a-santa > div {
          margin: calc(-240px + (240px * ${SCALE}));
          transform: scale(${SCALE});
        }
        .a-santa > div + * {
          margin-top: calc(-240px + (240px * ${SCALE}));
        }
        .a-santa > :not(div) {
          padding: 0 1rem;
        }
      `}</style>
    </div>
  );
}
