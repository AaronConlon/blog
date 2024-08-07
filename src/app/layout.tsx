import GoTop from "@/components/GoTop";
import { CONFIG } from "@/config";
import type { Metadata } from "next";
import { Jost } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Jost({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hi, This is Aaron Conlon's Blog",
  description: "A blog about software development and other things",
  openGraph: {
    images: [CONFIG.og.imageUrl ?? "/coder3.svg"],
    type: "website",
    siteName: "Aaron Conlon's Blog",
    title: "Hi, This is Aaron Conlon's Blog",
    url: process.env.DOMAIN!,
    description: "A blog about software development and other things",
  },
  twitter: {
    images: [
      {
        alt: "Og Image Alt",
        width: 360,
        height: 360,
        url: CONFIG.og.imageUrl ?? "/coder4.svg",
      },
    ],
    card: "summary_large_image",
    site: "Aaron Conlon's Blog",
    title: "Hi, This is Aaron Conlon's Blog",
    description: "A blog about software development and other things",
  },
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
