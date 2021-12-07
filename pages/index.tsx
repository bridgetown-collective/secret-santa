import "styled-jsx";

import FAQ from "../components/faq";
import Hero from "../components/hero";
import Mint from "../components/mint";
import Reveal from "../components/reveal";
import TheSantas from "../components/the-santas";

export default function Home() {
  return (
    <div className="inline-flex flex-col self-center mb-24">
      <div className="section  mx-12 md:mx-0 relative">
        <Hero />
      </div>

      <div className="section  mx-12 md:mx-0">
        <Mint />
      </div>

      <div className="section  mx-12 md:mx-0">
        <FAQ />
      </div>

      <div className="grid justify-items-center mx-12 md:mx-0">
        <img
          src="/assets/advent_calendar_01.gif"
          className="rounded-md max-w-lg h-auto align-middle border-none nice-shadow"
        />
      </div>

      <div className="section  mx-12 md:mx-0" id="reveal">
        <Reveal />
      </div>

      <div className="section  mx-12 md:mx-0">
        <TheSantas />
      </div>

      <style jsx>{`
        .section {
          display: flex;
          justify-content: space-around;
          margin: 2rem;
          padding: 2rem 4rem;
        }

        .section {
          background: url("/assets/cardboard.png");
          background-color: #7f3c10;
          border-radius: 1em;
          color: #ffa;
          box-shadow: var(--shadow-elevation-high-red);
        }

        .section:first-of-type{
          margin-top: 8em;
        }

      `}</style>
    </div>
  );
}
