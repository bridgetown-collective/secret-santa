import "styled-jsx";

import FAQ from "../components/faq";
import Hero from "../components/hero";
import Mint from "../components/mint";
import Reveal from "../components/reveal";
import TheSantas from "../components/the-santas";

export default function Home() {
  return (
    <div className="inline-flex flex-col self-center mb-24">
      <div className="section">
        <Hero />
      </div>

      <div className="section">
        <Mint />
      </div>

      <div className="section">
        <FAQ />
      </div>

      <div className="grid justify-items-center">
        <img
          src="/assets/advent_calendar_01.gif"
          className="rounded-md max-w-lg h-auto align-middle border-none nice-shadow"
        />
      </div>

      <div className="section" id="reveal">
        <Reveal />
      </div>

      <div className="section">
        <TheSantas />
      </div>

      <style jsx>{`
        .section {
          display: flex;
          justify-content: space-around;
          margin: 2rem 0;
          padding: 2rem 4rem;
        }
      `}</style>
    </div>
  );
}
