import Head from "next/head";
import "tailwindcss/tailwind.css";
import "styled-jsx";

export default function App({ Component, pageProps }) {
  return (
    <div className="container flex justify-center m-auto py-8">
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

      <Component {...pageProps} />

      <style jsx global>{`
        html,
        body {
          background: url("/assets/cardboard.png");
          background-color: #fff;
          font-family: "Noticia Text", serif;
          margin: 0;
          padding: 0;
        }

        .alt-font {
          font-family: "Special Elite", cursive;
        }

        button {
          background: url("/assets/cardboard.png");
          background-color: #0fa;
          cursor: pointer;
          display: block;
          padding: 1em 2em;
          outline: solid 1px black;
        }
        button:hover {
          background-color: #fa9;
        }
      `}</style>
    </div>
  );
}
