import GoTop from "@/components/GoTop";
import type { Metadata } from "next";
import { Jost } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Jost({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hi, This is Aaron Conlon's Blog",
  description: "A blog about software development and other things",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} w-full overflow-x-hidden`}>
        {children}
        <GoTop />
        <Script
          async
          src="https://unpkg.com/rough-notation/lib/rough-notation.iife.js"
        ></Script>
        <Script
          src="/scripts/raw-scripts.js"
          type={"text/javascript"}
          defer
        ></Script>
      </body>
    </html>
  );
}
