import Link from "next/link";
import Image from "next/image";
import notFound from "@/assets/404.svg";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Image src={notFound} alt="404" width={500} height={500} />
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-lg">The page you are looking for does not exist.</p>
      <Link href="/" className="text-blue-500">Go back to the home page</Link>
    </div>
  );
}