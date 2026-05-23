import { useEffect } from "react";
import { Route, Routes, useLocation } from 'react-router-dom';
import LandingLayout from './components/layouts/landing/layout';
import HomePage from './pages/home';
import NewsPage from './pages/news';
import ContactPage from './pages/contact';
import CoursePage from './pages/course';
import CourseDetailPage from './pages/course-detail';
import CourseLearningPage from './pages/course-learning';
import GamePage from './pages/game';
import TimeLinePage from './pages/timeline';
function Router() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<LandingLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/course" element={<CoursePage />} />
          <Route path="/course/:id" element={<CourseDetailPage />} />
          <Route path="/course/:id/learning" element={<CourseLearningPage />} />
          <Route path="/game/:id" element={<GamePage />} />
          <Route path="/time-line" element={<TimeLinePage />} />
        </Route>
      </Routes>
    </>
  );
}

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
}

export default Router;
