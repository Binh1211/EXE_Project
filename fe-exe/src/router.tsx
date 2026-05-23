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
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import AuthPage from './pages/auth';
import GoogleCallbackPage from './pages/auth/google-callback';
import ForgotPasswordPage from './pages/forgot-password';
import ResetPasswordPage from './pages/forgot-password/reset';
import ProfilePage from './pages/profile';
import ChangePasswordPage from './pages/profile/change-password';
import VipPage from './pages/vip';
import RequireAuth from '@/features/auth/components/RequireAuth';
import HostRoomView from "@/features/flashcard-room/components/HostRoomView";
import JoinRoomView from "@/features/flashcard-room/components/JoinRoomView";
import PlayRoomView from "@/features/flashcard-room/components/PlayRoomView";
import LeaderboardView from "@/features/flashcard-room/components/LeaderboardView";

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
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
          <Route path="/vip" element={<VipPage />} />
          <Route
            path="/profile/change-password"
            element={
              <RequireAuth>
                <ChangePasswordPage />
              </RequireAuth>
            }
          />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/forgot-password/reset" element={<ResetPasswordPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
        
        {/* Flashcard Rooms (No layout wrapper for full immersion) */}
        <Route
          path="/flashcard-rooms/host"
          element={
            <RequireAuth>
              <HostRoomView />
            </RequireAuth>
          }
        />
        <Route path="/flashcard-rooms/join" element={<JoinRoomView />} />
        <Route
          path="/flashcard-rooms/:code/play"
          element={
            <RequireAuth>
              <PlayRoomView />
            </RequireAuth>
          }
        />
        <Route path="/flashcard-rooms/:code/leaderboard" element={<LeaderboardView />} />
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