import Footer from "./Footer";
import Menu from "./Menu";
import { Scrollbars } from "react-custom-scrollbars";

export default function Layout({ children }) {
  return (
    <Scrollbars
      className="min-h-screen flex-col flex"
      autoHide
      autoHideTimeout={1000}
      autoHideDuration={200}
    >
      <Menu />
      <div className="flex-grow flex flex-col max-w-[1200px] mx-auto w-full">
        <div className="flex-grow">{children}</div>
      </div>
      <Footer />
    </Scrollbars>
  );
}
