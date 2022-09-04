import Footer from "./Footer";
import Menu from "./Menu";

export default function Layout({ children }) {
  return (
    <>
      <main className="min-h-screen mx-auto max-w-[1200px] flex">
        <Menu />
        <div className="flex-grow flex flex-col">
          <div className="flex-grow">{children}</div>
          <Footer />
        </div>
      </main>
    </>
  );
}
