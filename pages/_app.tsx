import Head from "next/head";
import Nav from "./../components/nav";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "styled-jsx";
import "tailwindcss/tailwind.css";

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
        <link rel="icon" type="image/x-icon" href="/assets/favicon.ico"></link>

        {/*<!-- Primary Meta Tags -->*/}
        <meta name="title" content="Raging Santas NFT" />
        <meta
          name="description"
          content="Raging Santas is the first ever on-chain secret santa NFT swap. Join in on the fun today!"
        />

        {/*<!-- Open Graph / Facebook -->*/}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.ragingsantas.xyz/" />
        <meta property="og:title" content="Raging Santas NFT" />
        <meta
          property="og:description"
          content="Raging Santas is the first ever on-chain secret santa NFT swap. Join in on the fun today!"
        />
        <meta
          property="og:image"
          content="https://ragingsantas.xyz/assets/advent_calendar.png"
        />

        {/*<!-- Twitter -->*/}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.ragingsantas.xyz/" />
        <meta property="twitter:title" content="Raging Santas NFT" />
        <meta
          property="twitter:description"
          content="Raging Santas is the first ever on-chain secret santa NFT swap. Join in on the fun today!"
        />
        <meta
          property="twitter:image"
          content="https://ragingsantas.xyz/assets/advent_calendar.png"
        />
      </Head>

      <Nav />

      <div className="container flex m-auto py-40 -mt-40">
        <Component {...pageProps} />
        <ToastContainer position="top-right" autoClose={5000} />
      </div>

      <style jsx global>{`
        html,
        body {
          background: url("/assets/cardboard.png");
          background-color: var(--color-red);
          font-family: "Noticia Text", serif;
          margin: 0;
          padding: 0;
        }

        .alt-font {
          font-family: "Iniya";
        }
        .nice-shadow {
          box-shadow: var(--shadow-elevation-medium-brown);
        }

        button {
          background: url("/assets/cardboard.png");
          /*background-color: #0fa;*/
          background-color: #16a818;
          cursor: pointer;
          display: block;
          padding: 1em 2em;
          outline: solid 1px black;
        }
        button:hover {
          background-color: #f49898;
        }

        @font-face {
          font-family: "LogoFont";
          src: url("/assets/CanterburyRegular-MVqn.ttf");
        }

        @font-face {
          font-family: "Iniya";
          src: url("/assets/IniyaDisplay-ow0Ra.otf");
        }

        a.anchor {
          display: block;
          position: relative;
          top: -150px;
          visibility: hidden;
        }

        .text-shadow {
          text-shadow: 2px 1px var(--toastify-color-dark);
        }

        .text-shadow-green {
          text-shadow: 3px 1px var(--toastify-color-progress-success);
        }

        .iniya-header {
          font-family: "Iniya";
          text-shadow: 3px 1px var(--toastify-color-dark);
        }

        .color-pink {
          color: var(--color-pink);
        }

        :root {
          --shadow-color-red: 359deg 93% 22%;
          --shadow-elevation-low-red: 0.4px 0.3px 0.6px
              hsl(var(--shadow-color-red) / 0.34),
            0.6px 0.5px 0.9px -1.2px hsl(var(--shadow-color-red) / 0.34),
            1.4px 1.3px 2.1px -2.5px hsl(var(--shadow-color-red) / 0.34);
          --shadow-elevation-medium-red: 0.4px 0.3px 0.6px
              hsl(var(--shadow-color-red) / 0.36),
            1.2px 1.1px 1.8px -0.8px hsl(var(--shadow-color-red) / 0.36),
            3px 2.7px 4.5px -1.7px hsl(var(--shadow-color-red) / 0.36),
            7.2px 6.5px 10.9px -2.5px hsl(var(--shadow-color-red) / 0.36);
          --shadow-elevation-high-red: 0.4px 0.3px 0.6px
              hsl(var(--shadow-color-red) / 0.34),
            2.1px 1.9px 3.2px -0.4px hsl(var(--shadow-color-red) / 0.34),
            3.9px 3.5px 5.9px -0.7px hsl(var(--shadow-color-red) / 0.34),
            6.5px 5.8px 9.8px -1.1px hsl(var(--shadow-color-red) / 0.34),
            10.3px 9.2px 15.5px -1.4px hsl(var(--shadow-color-red) / 0.34),
            16.1px 14.4px 24.3px -1.8px hsl(var(--shadow-color-red) / 0.34),
            24.5px 22px 37px -2.1px hsl(var(--shadow-color-red) / 0.34),
            36.1px 32.3px 54.5px -2.5px hsl(var(--shadow-color-red) / 0.34);
          --shadow-color-brown: 24deg 100% 15%;
          --shadow-elevation-low-brown: 0.4px 0.3px 0.6px
              hsl(var(--shadow-color-brown) / 0.34),
            0.6px 0.5px 0.9px -1.2px hsl(var(--shadow-color-brown) / 0.34),
            1.4px 1.3px 2.1px -2.5px hsl(var(--shadow-color-brown) / 0.34);
          --shadow-elevation-medium-brown: 0.4px 0.3px 0.6px
              hsl(var(--shadow-color-brown) / 0.36),
            1.2px 1.1px 1.8px -0.8px hsl(var(--shadow-color-brown) / 0.36),
            3px 2.7px 4.5px -1.7px hsl(var(--shadow-color-brown) / 0.36),
            7.2px 6.5px 10.9px -2.5px hsl(var(--shadow-color-brown) / 0.36);
          --shadow-elevation-high-brown: 0.4px 0.3px 0.6px
              hsl(var(--shadow-color-brown) / 0.34),
            2.1px 1.9px 3.2px -0.4px hsl(var(--shadow-color-brown) / 0.34),
            3.9px 3.5px 5.9px -0.7px hsl(var(--shadow-color-brown) / 0.34),
            6.5px 5.8px 9.8px -1.1px hsl(var(--shadow-color-brown) / 0.34),
            10.3px 9.2px 15.5px -1.4px hsl(var(--shadow-color-brown) / 0.34),
            16.1px 14.4px 24.3px -1.8px hsl(var(--shadow-color-brown) / 0.34),
            24.5px 22px 37px -2.1px hsl(var(--shadow-color-brown) / 0.34),
            36.1px 32.3px 54.5px -2.5px hsl(var(--shadow-color-brown) / 0.34);

          --color-green: #16a818;
          --color-pink: #efa6a4;
          --color-yellow: #d1cf49;
          --color-red: #b51316;
          --color-brown: #7f3c10;
        }

        .section {
          display: flex;
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

        .section:first-of-type {
          margin-top: 8em;
        }
      `}</style>
    </div>
  );
}
