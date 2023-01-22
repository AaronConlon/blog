import "@/styles/globals.css";
import "windi.css";

import type { AppProps } from "next/app";
import Head from "next/head";
import LabelList from "@/components/LabelList";
import Layout from "@/layout";
import NextNProgress from "nextjs-progressbar";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.add("light");
    }
    // add global init debug mode function
    // @ts-ignore
    globalThis.__switchDebugMode = () => {
      const mode = localStorage.getItem("debug");
      if (mode) {
        localStorage.removeItem("debug");
      } else {
        localStorage.setItem("debug", "true");
      }
      window.location.reload();
    };
  }, []);

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <NextNProgress color="#a865bb" />
      <LabelList />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
