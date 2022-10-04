import Footer from "./Footer";
import Menu from "./Menu";

export default function Layout({ children }) {
  return (
    <>
      <main className="min-h-screen">
        <Menu />
        <div className="flex-grow flex flex-col max-w-[1200px] mx-auto">
          <div className="flex-grow">{children}</div>
          <Footer />
        </div>
      </main>
    </>
  );
}
