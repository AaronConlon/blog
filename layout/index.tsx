import Footer from "./Footer";
import Menu from "./Menu";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex-col flex max-w-screen">
      <Menu />
      <div
        className="flex-grow flex flex-col max-w-screen lg:max-w-[1200px] mx-auto px-4 lg:px-0"
        // style={{ width: "max(100vw, 1200px)" }}
      >
        <div className="flex-grow">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
