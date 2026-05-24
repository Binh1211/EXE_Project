import { Outlet } from "react-router";
import Footer from "./footer";
import Header from "./header";
import { IMG } from "@/lib/images";

function LandingLayout() {
  return (
    <div
      className="flex min-h-screen flex-col bg-cover font-history"
      style={{ backgroundImage: `url(${IMG.paperTexture})` }}
    >
      <Header />

      <Outlet />

      <Footer />
    </div>
  );
}

export default LandingLayout;
