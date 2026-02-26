import { Route, Routes } from 'react-router';
import LandingLayout from './components/layouts/landing/layout';
import HomePage from './pages/home';
import NewsPage from './pages/news';
import ContactPage from './pages/contact';

function Router() {
  return (
    <>
      <Routes>
        <Route element={<LandingLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default Router;
