import { Router } from "express";
import authRoutes from "./auth.routes.js";
import timelineRoutes from "./timeline.routes.js";
import chapterRoutes from "./chapter.routes.js";
import lessonRoutes from "./lesson.routes.js";
import lessonProgressRoutes from "./lesson-progress.routes.js";
import faqRoutes from "./faq.routes.js";
import flashcardSetRoutes from "./flashcard-set.routes.js";
import notificationRoutes from "./notification.routes.js";
import quizRoutes from "./quiz.routes.js";
import quizAttemptRoutes from "./quiz-attempt.routes.js";
import groupRoutes from "./group.routes.js";
import paymentRoutes from "./payment.routes.js";
import groupGameSessionRoutes from "./group-game-session.routes.js";
import leaderboardEntryRoutes from "./leaderboard-entry.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/timeline", timelineRoutes);
router.use("/chapters", chapterRoutes);
router.use("/lessons", lessonRoutes);
router.use("/lesson-progress", lessonProgressRoutes);
router.use("/faqs", faqRoutes);
router.use("/flashcard-sets", flashcardSetRoutes);
router.use("/notifications", notificationRoutes);
router.use("/quizzes", quizRoutes);
router.use("/quiz-attempts", quizAttemptRoutes);
router.use("/groups", groupRoutes);
router.use("/payments", paymentRoutes);
router.use("/group-game-sessions", groupGameSessionRoutes);
router.use("/leaderboard-entries", leaderboardEntryRoutes);

export default router;
