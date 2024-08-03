import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="font-bold whitespace-nowrap text-md md:text-2xl">
      AaronConlon<span className="text-primary">.dev</span>
    </Link>
  );
}
