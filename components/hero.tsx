import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="flex flex-wrap justify-around md:flex-row flex-col-reverse">
      <div className="flex flex-col justify-center text-left md:mr-12">
        <p className="text-4xl alt-font">Ready to rage?</p>
        <p className="text-xl mt-4 mb-4">
          Decking the halls December 25th, 2021
        </p>
        <Link href="#mint">
          <button className="text-xl alt-font">Mint Now</button>
        </Link>
      </div>

      <div className="md:m-0 m-8">
        <Image
          src="/assets/raging_santas_slowed.gif"
          alt=""
          width={300}
          height={300}
        />
      </div>
    </div>
  );
}
