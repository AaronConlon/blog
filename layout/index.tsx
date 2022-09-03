import Footer from "./Footer";
import Menu from "./Menu";

export default function Layout({ children }) {
  return (
    <main className="flex flex-col min-h-screen mx-auto max-w-[1200px]">
      <Menu />
      <div className="flex-grow">{children}</div>
      <Footer />
    </main>
  );
}
