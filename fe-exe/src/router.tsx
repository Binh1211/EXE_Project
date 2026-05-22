import { Route, Routes } from 'react-router-dom';
import LandingLayout from './components/layouts/landing/layout';
import HomePage from './pages/home';
import NewsPage from './pages/news';
import ContactPage from './pages/contact';
import CoursePage from './pages/course';
import CourseDetailPage from './pages/course-detail';
import CourseLearningPage from './pages/course-learning';
import GamePage from './pages/game';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import AuthPage from './pages/auth';
import GoogleCallbackPage from './pages/auth/google-callback';

function Router() {
  return (
    <>
      <Routes>
        <Route element={<LandingLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/course" element={<CoursePage />} />
          <Route path="/course/:id" element={<CourseDetailPage />} />
          <Route path="/course/:id/learning" element={<CourseLearningPage />} />
          <Route path="/game/:id" element={<GamePage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
      </Routes>
    </>
  );
}

export default Router;

