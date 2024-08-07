import GoTop from "@/components/GoTop";
import type { Metadata } from "next";
import { Jost } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Jost({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hi, This is Aaron Conlon's Blog",
  description: "A blog about software development and other things",
  openGraph: {
    images: ["/coder3.svg"],
    type: "website",
    siteName: "Aaron Conlon's Blog",
    title: "Hi, This is Aaron Conlon's Blog",
    url: process.env.DOMAIN!,
    description: "A blog about software development and other things",
  },
  twitter: {
    images: [
      {
        url: "https://pbs.twimg.com/semantic_core_img/1775195893546856453/f6CELbJn?format=jpg&name=360x360",
        alt: "Og Image Alt",
        width: 360,
        height: 360,
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
