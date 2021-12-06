import Link from "next/link";

export default function Nav({}) {
  const onCollapse = e => {
    var x = window.document.getElementById("mobileDropdownMenu");
    x.classList.toggle("hidden");
  };

  return (
    <nav
      id="pageNav"
      className="flex fixed items-center justify-between flex-wrap p-2"
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
            className="text-4xl tracking-tight"
            style={{ fontFamily: "LogoFont" }}
          >
            Raging Santas
          </span>
        </div>
      </Link>
      <div className="block lg:hidden">
        <button
          className="flex items-center px-3 py-2 border rounded"
          onClick={onCollapse}
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
        className="hidden w-full block flex-grow lg:flex lg:items-center lg:w-auto"
      >
        <div className="text-md font-semibold	pt-2 lg:pt-0 lg:flex-grow text-red-700">
          <s className="mr-4">FEEL the love</s>
          <a
            href="#responsive-header"
            className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
          >
            SHARE the Rage
          </a>
          <a
            href="#responsive-header"
            className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
          >
            MINT a Santa
          </a>
          <a
            href="#responsive-header"
            className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white"
          >
            EXCHANGE an NFT
          </a>
        </div>
        <div>
          <a
            href="#"
            className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
          >
            Connect
          </a>
        </div>
      </div>
      <script>{`
            function myFunction() {
            }
        `}</script>
    </nav>
  );
}
