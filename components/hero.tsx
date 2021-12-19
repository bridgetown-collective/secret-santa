import Link from "next/link";
import Image from "next/image";
import About from "./about";

export default function Hero() {
  return (
    <div className="flex flex-wrap justify-around flex-col">
      <div className="flex-col lg:hidden justify-center text-left md:mr-12 lg:pr-40">
        <div className="relative">
          <p className="text-5xl font-bold mb-12 iniya-header">
            On-Chain <br/>NFT Secret Santa Swap
          </p>
        </div>
      </div>

      <div className="pl-0 text-center pb-12 santa-gif">
        <Image
          className="rounded-full nice-shadow"
          src="/assets/raging_santas_animated_preview.gif"
          alt=""
          width={400}
          height={400}
        />
      </div>

      <div className="hidden lg:flex lg:flex-col justify-center text-left md:mr-12 lg:pr-40">
        <p className="text-5xl font-bold mb-12 iniya-header">
          On-Chain<br/>NFT Secret Santa Swap
        </p>
        <About />
      </div>

      <div className="flex-col lg:hidden justify-center text-left lg:pr-40">
        <About />
        <Link href="#mint">
          <button className="text-xl mt-10 nice-shadow rounded-md outline-none m-auto w-full">
            Rage On!
          </button>
        </Link>
      </div>

      <div className="hidden lg:flex lg:flex-col justify-center text-left lg:pr-0">
        <Link href="#mint">
          <button className="text-xl mt-16 nice-shadow rounded-md outline-none w-full">
            Rage On!
          </button>
        </Link>
      </div>

      <style jsx global>{`
        .santa-gif {
          padding-top: 0;
          margin: auto;
          width: 287px;
        }

        @media (min-width: 1024px) {
          .santa-gif {
            position: absolute;
            top: -2rem;
            right: -28px;
            width: 357px;
          }
        }

        @media (min-width: 1520px) {
          .santa-gif {
            position: absolute;
            top: 35px;
            right: 136px;
          }
        }
      `}</style>
    </div>
  );
}
