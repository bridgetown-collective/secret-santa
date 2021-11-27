import "tailwindcss/tailwind.css";
import "styled-jsx";

export default function App({ Component, pageProps }) {
  return (
    <div className="page flex flex-col m-8 text-center justify-center">
      <Component {...pageProps} />

      <style jsx global>{`
        html,
        body {
          background: url("/assets/cardboard.png");
          background-color: #fff;
          margin: 0;
          padding: 0;
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
