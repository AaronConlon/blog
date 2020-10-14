import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import "../styles/global.css";
import { AppProps } from "next/app";

export default function App({
  Component,
  pageProps,
}: // eslint-disable-next-line no-undef
AppProps): React.ReactNode {
  return (
    <ThemeProvider>
      <CSSReset />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
