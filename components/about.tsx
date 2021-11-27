import Link from "next/link";

export default function About() {
  return (
    <div>
      <p className="text-2xl m-2">Information about the project coming soon</p>
      <Link href="/the-pool">
        <button>Dive into the Gift Pool</button>
      </Link>
    </div>
  );
}
