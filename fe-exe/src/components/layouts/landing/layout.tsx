import { Outlet } from 'react-router';
import Footer from './footer';

function LandingLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default LandingLayout;
