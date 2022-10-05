import Footer from "./Footer";
import Menu from "./Menu";

export default function Layout({ children }) {
  return (
    <>
      <main className="min-h-screen flex-col flex">
        <Menu />
        <div className="flex-grow flex flex-col max-w-[1200px] mx-auto w-full">
          <div className="flex-grow">{children}</div>
        </div>
        <Footer />
      </main>
    </>
  );
}
