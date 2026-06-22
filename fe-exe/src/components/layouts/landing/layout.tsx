import { Outlet } from "react-router";
import Footer from "./footer";
import Header from "./header";
import { IMG } from "@/lib/images";
import { useTheme } from "@/lib/ThemeContext";
import { FeedbackWidget } from "@/components/shared/feedback-widget";

function LandingLayout() {
  const { isDark } = useTheme();

  return (
    <div
      className="flex min-h-screen flex-col bg-cover font-history transition-all duration-500"
      style={{
        backgroundImage: isDark
          ? `url(${IMG.bgDarkmode})`
          : `url(${IMG.paperTexture})`,
      }}
    >
      <Header />

      <Outlet />

      <Footer />
      <FeedbackWidget />
    </div>
  );
}

export default LandingLayout;
