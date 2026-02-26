import { Outlet } from "react-router";
import Footer from "./footer";
import Header from "./header";

function LandingLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fbf0ce]">
      <Header />

      <Outlet />

      <Footer />
    </div>
  );
}

export default LandingLayout;
