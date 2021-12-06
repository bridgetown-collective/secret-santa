import Link from "next/link";
import Image from "next/image";
import About from "./about";

export default function Hero() {
  return (
    <div className="flex flex-wrap justify-around flex-row">
      <div className="flex flex-col justify-center text-left md:mr-12">
        <p className="text-4xl alt-font mb-12">
          The first ever Secret Santa NFT Swap
        </p>

        <About />

        <Link href="#mint">
          <button className="text-xl mt-10 alt-font nice-shadow rounded-md outline-none">
            Yes! Let's Deck The Halls!
          </button>
        </Link>
      </div>

      <div className="pl-0 lg:pl-8 santa-gif">
        <Image
          className="rounded-full nice-shadow"
          src="/assets/raging_santas_slowed.gif"
          alt=""
          width={400}
          height={400}
        />
      </div>
      <style jsx global>{`
        .santa-gif {
          padding-top: 2.5rem;
        }
      `}</style>
    </div>
  );
}
