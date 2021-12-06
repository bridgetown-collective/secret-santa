import Head from "next/head";
import "tailwindcss/tailwind.css";
import "styled-jsx";

export default function App({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Raging Santas NFT</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Noticia+Text&family=Special+Elite&display=swap"
          rel="stylesheet"
        ></link>
      </Head>

      <nav class="flex items-center justify-between flex-wrap p-2">
        <div class="w-24 sm:w-24 px-4">
          <img src="/assets/hi-res-logo.png" class="rounded-full max-w-full h-auto align-middle border-none"/>
        </div>
        <div class="flex items-center flex-shrink-0 mr-6">
          <span class="text-4xl tracking-tight" style={{fontFamily: 'LogoFont'}}>Raging Santas</span>
        </div>
        <div class="block lg:hidden">
          <button class="flex items-center px-3 py-2 border rounded hover:text-white hover:border-white">
            <svg
              class="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          <div class="text-md font-semibold	pt-2 lg:pt-0 lg:flex-grow text-red-700">
            <s class="mr-4">FEEL the love</s>
            <a
              href="#responsive-header"
              class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
            >
              SHARE the Rage
            </a>
            <a
              href="#responsive-header"
              class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
            >
              MINT a Santa
            </a>
            <a
              href="#responsive-header"
              class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white"
            >
              EXCHANGE an NFT
            </a>
          </div>
          <div>
            <a
              href="#"
              class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
            >
              Connect
            </a>
          </div>
        </div>
      </nav>

      <div className="container flex justify-center m-auto py-8">
        <Component {...pageProps} />
      </div>

      <style jsx global>{`
        html,
        body {
          background: url("/assets/cardboard.png");
          background-color: #b51316;
          font-family: "Noticia Text", serif;
          margin: 0;
          padding: 0;
        }

        .alt-font {
          font-family: "Special Elite", cursive;
        }

        nav {
          background: url("/assets/cardboard.png");
          background-color: #efa6a4;
          color: black;
        }

        .section {
          background: url("/assets/cardboard.png");
          background-color: #7F3C10;
          border-radius: 2em;
          color: #ffa;
          box-shadow: var(--shadow-elevation-high-red);
        }

        .nice-shadow {
          box-shadow: var(--shadow-elevation-high-brown);
        }

        button {
          background: url("/assets/cardboard.png");
          /*background-color: #0fa;*/
          background-color: #16A818;
          cursor: pointer;
          display: block;
          padding: 1em 2em;
          outline: solid 1px black;
        }
        button:hover {
          background-color: #f49898;
        }

        @font-face {
          font-family: 'LogoFont';
          src: url('/assets/CanterburyRegular-MVqn.ttf');
        }

        :root {
          --shadow-color-red: 359deg 93% 22%;
          --shadow-elevation-low-red:
            0.4px 0.3px 0.6px hsl(var(--shadow-color-red) / 0.34),
            0.6px 0.5px 0.9px -1.2px hsl(var(--shadow-color-red) / 0.34),
            1.4px 1.3px 2.1px -2.5px hsl(var(--shadow-color-red) / 0.34);
          --shadow-elevation-medium-red:
            0.4px 0.3px 0.6px hsl(var(--shadow-color-red) / 0.36),
            1.2px 1.1px 1.8px -0.8px hsl(var(--shadow-color-red) / 0.36),
            3px 2.7px 4.5px -1.7px hsl(var(--shadow-color-red) / 0.36),
            7.2px 6.5px 10.9px -2.5px hsl(var(--shadow-color-red) / 0.36);
          --shadow-elevation-high-red:
            0.4px 0.3px 0.6px hsl(var(--shadow-color-red) / 0.34),
            2.1px 1.9px 3.2px -0.4px hsl(var(--shadow-color-red) / 0.34),
            3.9px 3.5px 5.9px -0.7px hsl(var(--shadow-color-red) / 0.34),
            6.5px 5.8px 9.8px -1.1px hsl(var(--shadow-color-red) / 0.34),
            10.3px 9.2px 15.5px -1.4px hsl(var(--shadow-color-red) / 0.34),
            16.1px 14.4px 24.3px -1.8px hsl(var(--shadow-color-red) / 0.34),
            24.5px 22px 37px -2.1px hsl(var(--shadow-color-red) / 0.34),
            36.1px 32.3px 54.5px -2.5px hsl(var(--shadow-color-red) / 0.34);
          --shadow-color-brown: 24deg 100% 15%;
          --shadow-elevation-low-brown:
            0.4px 0.3px 0.6px hsl(var(--shadow-color-brown) / 0.34),
            0.6px 0.5px 0.9px -1.2px hsl(var(--shadow-color-brown) / 0.34),
            1.4px 1.3px 2.1px -2.5px hsl(var(--shadow-color-brown) / 0.34);
          --shadow-elevation-medium-brown:
            0.4px 0.3px 0.6px hsl(var(--shadow-color-brown) / 0.36),
            1.2px 1.1px 1.8px -0.8px hsl(var(--shadow-color-brown) / 0.36),
            3px 2.7px 4.5px -1.7px hsl(var(--shadow-color-brown) / 0.36),
            7.2px 6.5px 10.9px -2.5px hsl(var(--shadow-color-brown) / 0.36);
          --shadow-elevation-high-brown:
            0.4px 0.3px 0.6px hsl(var(--shadow-color-brown) / 0.34),
            2.1px 1.9px 3.2px -0.4px hsl(var(--shadow-color-brown) / 0.34),
            3.9px 3.5px 5.9px -0.7px hsl(var(--shadow-color-brown) / 0.34),
            6.5px 5.8px 9.8px -1.1px hsl(var(--shadow-color-brown) / 0.34),
            10.3px 9.2px 15.5px -1.4px hsl(var(--shadow-color-brown) / 0.34),
            16.1px 14.4px 24.3px -1.8px hsl(var(--shadow-color-brown) / 0.34),
            24.5px 22px 37px -2.1px hsl(var(--shadow-color-brown) / 0.34),
            36.1px 32.3px 54.5px -2.5px hsl(var(--shadow-color-brown) / 0.34);
        }
        
    `}</style>
    </div>
  );
}
