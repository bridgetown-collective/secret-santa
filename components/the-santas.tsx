import Image from "next/image";

const THE_TEAM: string[] = [
  "GrumpySanta",
  "HanukkahHarry",
  "ShortSanta",
  "DrZarkov",
];

export default function TheSantas() {
  return (
    <div id="the-santas" className="flex flex-col alt-font">
      <p className="text-4xl text-center">The Santas</p>

      <div className="flex flex-wrap justify-center">
        {THE_TEAM.map((name) => (
          <div key={name} className="a-santa inline-block m-4">
            <Image
              className="nice-shadow"
              src={`/assets/${name}.png`}
              height={250}
              width={250}
              alt={name}
            />
            <h3 className="text-center">{name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
