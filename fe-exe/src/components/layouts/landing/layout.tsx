import { Outlet } from "react-router";
import Footer from "./footer";
import Header from "./header";

function LandingLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[url('/img/paper-texture.png')] bg-cover font-history">
      <Header />

      <Outlet />

      <Footer />
    </div>
  );
}

export default LandingLayout;
