import Link from "next/link";
// import Image from "next/image";
import "styled-jsx";

export default function Header() {
  return (
    <div>
      <Link href="/">
        <p className="text-xl alt-font">Raging Santas</p>
      </Link>

      <style jsx>{`
        div {
          background-color: #f49898;
        }
      `}</style>
    </div>
  );
}
