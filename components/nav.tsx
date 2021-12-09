import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import useWeb3 from "../lib/use-web3";

export default function Nav({}) {
  const { account, requestConnection } = useWeb3();
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <nav
      id="pageNav"
      className="flex fixed items-center justify-between flex-wrap lg:flex-nowrap p-2 mt-0 top-0"
    >
      <Link href="/">
        <div className="w-24 sm:w-24 px-4 cursor-pointer">
          <img
            src="/assets/hi-res-logo.png"
            className="rounded-full max-w-full h-auto align-middle border-none"
          />
        </div>
      </Link>
      <Link href="/">
        <div className="flex items-center flex-shrink-0 mr-6 cursor-pointer">
          <span
            className="text-5xl xl:text-6xl tracking-tight"
            style={{ fontFamily: "LogoFont" }}
          >
            Raging Santas
          </span>
        </div>
      </Link>

      <div className="block lg:hidden">
        <button
          className="flex items-center px-3 py-2 border rounded cursor-pointer"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>

      <div
        id="mobileDropdownMenu"
        className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${
          !isNavOpen ? "hidden" : ""
        }`}
      >
        <div className="text-md font-semibold	pt-2 lg:pt-0 lg:flex-grow text-red-700">
          <a
            href="#mint"
            className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4 cursor-pointer"
          >
            GIVE
          </a>
          <a
            href="#claim"
            className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4 cursor-pointer"
          >
            CLAIM
          </a>
          <a
            href="#faq"
            className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4 cursor-pointer"
          >
            FAQ
          </a>
          <a
            href="#the-santas"
            className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4 cursor-pointer"
          >
            TEAM
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              // @TODO: link to the user's "gifted" page to show off -- "I just gifted, you should too"
              "SHARE the Rage! https://ragingsantas.xyz @RagingSantasNFT"
            )}`}
            target="_blank"
            className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4 cursor-pointer"
          >
            SHARE the RAGE
          </a>
        </div>
        <div className="flex flex-row mt-2">
          <span>
            <a href="https://twitter.com/RagingSantasNFT" target="_blank">
              <Image
                className="cursor-pointer"
                src="/assets/twitter-logo.svg"
                height="45"
                width="45"
              />
            </a>
          </span>
          <span className="mx-5">
            <a href="https://opensea.io" target="_blank">
              <Image
                className="cursor-pointer"
                src="/assets/opensea-logo.svg"
                height="45"
                width="45"
              />
            </a>
          </span>
        </div>
        <div>
          <p
            className="inline-block text-sm px-4 py-2 leading-none border rounded text-black border-black hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0 cursor-pointer"
            onClick={requestConnection}
          >
            {account ? `${account.slice(0, 10)}...` : "Login"}
          </p>
        </div>
      </div>

      <style jsx global>{`
        nav {
          background: url("/assets/cardboard.png");
          background-color: var(--color-pink);
          color: black;
          box-shadow: var(--shadow-elevation-medium-red);
          width: 100%;
          z-index: 10;
        }
      `}</style>
    </nav>
  );
}
