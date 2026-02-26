import { Route, Routes } from 'react-router';
import HomePage from './pages/home';
import LandingLayout from './components/layouts/landing/layout';

function Router() {
  return (
    <>
      <Routes>
        <Route element={<LandingLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default Router;
