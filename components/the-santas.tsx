import Image from "next/image";

const THE_TEAM: string[] = [
  "GrumpySanta",
  "HanukkahHarry",
  "ShortSanta",
  "dr zarkov",
];

export default function TheSantas() {
  return (
    <div id="the-santas" className="flex flex-col">
      <p className="text-4xl text-center">The Santas</p>

      <div className="flex flex-wrap justify-center">
        {THE_TEAM.map((name) => (
          <div key={name} className="a-santa inline-block m-4">
            <Image
              src={`/assets/${name}.png`}
              height={150}
              width={150}
              alt={name}
            />
            <h3 className="text-center">{name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
