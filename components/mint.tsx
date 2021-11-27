import Link from "next/link";

import RequireWeb3 from "./require-web3";

export default function Mint() {
  return (
    <div className="container flex justify-center">
      <div className="block" style={{ marginRight: "4rem" }}>
        <p>TODO: Create a mint component</p>
        <Link href="/my-gallery">
          <button>View My NFTs</button>
        </Link>
      </div>

      <div className="block">
        <RequireWeb3>
          <button disabled>Mint Now</button>
        </RequireWeb3>
      </div>
    </div>
  );
}
