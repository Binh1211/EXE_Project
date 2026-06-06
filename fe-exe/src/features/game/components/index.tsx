import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Gamepad2, Loader2 } from "lucide-react";
import "./Game.css";
import { IMG } from "@/lib/images";
import { lessonApi } from "@/features/course/api/lesson-api";
import { lessonProgressApi } from "@/features/course/api/lesson-progress-api";
import {
  mapQuizToGameQuestions,
  type GameQuestion,
} from "../lib/map-quiz-to-game";

type AnswerRecord = {
  questionIndex: number;
  question: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
};

const getGrade = (correctCount: number, totalQuestions: number): string => {
  const percentage = (correctCount / totalQuestions) * 100;
  if (percentage === 100) return "A+";
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B+";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  return "F";
};

const OBSTACLE_GAP = 200;
const MOVE_SPEED = 4;

export default function HistoryMiniGame() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [passingScore, setPassingScore] = useState(70);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [loadError, setLoadError] = useState("");

  const [started, setStarted] = useState(false);
  const [position, setPosition] = useState(0);
  const [current, setCurrent] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [lives, setLives] = useState(3);
  const [jump, setJump] = useState(false);
  const [hurt, setHurt] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [queue, setQueue] = useState<number[]>([]);
  const [obstacles, setObstacles] = useState<number[]>([]);
  const [destroyed, setDestroyed] = useState<boolean[]>([]);
  const [destroyBurst, setDestroyBurst] = useState<number | null>(null);
  const [timer, setTimer] = useState(15);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState("0:00");
  const [history, setHistory] = useState<AnswerRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState<"correct" | "wrong" | null>(
    null,
  );
  const [savingProgress, setSavingProgress] = useState(false);

  const rafRef = useRef<number>(0);
  const worldRef = useRef<HTMLDivElement | null>(null);
  const [worldWidth, setWorldWidth] = useState(0);
  const questionCount = questions.length;

  const backUrl = "/game/vuot-rao";

  useEffect(() => {
    if (!lessonId) {
      setLoadState("error");
      setLoadError("Thiếu mã bài học. Mở game từ trang học bài (tab Quiz).");
      return;
    }

    setLoadState("loading");
    lessonApi
      .getLessonDetail(lessonId)
      .then((detail) => {
        const mapped = mapQuizToGameQuestions(detail.quizData ?? null);
        if (mapped.length === 0) {
          setLoadState("error");
          setLoadError("Bài học này chưa có câu hỏi quiz.");
          return;
        }
        setQuestions(mapped);
        setQuizTitle(detail.quizData?.title ?? "Quiz ôn tập");
        setPassingScore(detail.quizData?.passingScore ?? 70);
        setLoadState("ready");
      })
      .catch(() => {
        setLoadState("error");
        setLoadError("Không tải được quiz. Vui lòng đăng nhập và thử lại.");
      });
  }, [lessonId]);

  const initRun = useCallback(() => {
    if (questionCount === 0) return;
    const initialObstacles = questions.map((_, i) => 200 + i * OBSTACLE_GAP);
    setQueue(questions.map((_, i) => i));
    setObstacles(initialObstacles);
    setDestroyed(new Array(questionCount).fill(false));
    setPosition(0);
    setCurrent(0);
    setCorrectCount(0);
    setLives(3);
    setHistory([]);
    setShowHistory(false);
    setStartTime(Date.now());
    setElapsedTime("0:00");
  }, [questionCount, questions]);

  useEffect(() => {
    if (!started) return;
    initRun();
  }, [started, initRun]);

  useEffect(() => {
    const updateWidth = () => {
      if (worldRef.current) {
        setWorldWidth(worldRef.current.clientWidth);
      } else {
        setWorldWidth(Math.floor(window.innerWidth * 0.99));
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const shiftScreen = useCallback(() => {
    const nextQueue = queue.slice(current);
    setQueue(nextQueue);
    setObstacles(
      Array.from({ length: nextQueue.length }, (_, idx) => 200 + idx * OBSTACLE_GAP),
    );
    setDestroyed((prev) => prev.slice(current));
    setCurrent(0);
    setPosition(0);
  }, [current, queue]);

  useEffect(() => {
    if (!showQuestion) return;
    setTimer(15);
    setSelectedOption(null);
    setAnswerFeedback(null);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          handleWrongAnswer(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showQuestion, current]);

  useEffect(() => {
    if (!started || questionCount === 0 || correctCount === questionCount || current >= queue.length) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      setElapsedTime(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    }, 100);

    return () => clearInterval(interval);
  }, [started, startTime, correctCount, questionCount, current, queue.length]);

  const currentQuestionIndex = queue[current];
  const q =
    currentQuestionIndex !== undefined
      ? questions[currentQuestionIndex]
      : null;

  const pushWrongObstacle = useCallback(() => {
    setQueue((prev) => {
      const idx = prev[current];
      return idx !== undefined ? [...prev, idx] : prev;
    });

    setObstacles((prev) => {
      return [...prev, (prev[prev.length - 1] ?? 200) + OBSTACLE_GAP];
    });

    setDestroyed((prev) => [...prev, false]);
  }, [current]);

  const handleWrongAnswer = useCallback(
    (timedOut = false) => {
      if (timedOut && q) {
        setHistory((prev) => [
          ...prev,
          {
            questionIndex: queue[current] ?? 0,
            question: q.question,
            correctAnswer: q.answer,
            userAnswer: "(Hết giờ)",
            isCorrect: false,
          },
        ]);
      }
      setLives((l) => l - 1);
      setHurt(true);
      setJump(true);
      setTimeout(() => {
        setJump(false);
        setHurt(false);
      }, 500);
      pushWrongObstacle();
      setShowQuestion(false);
      setCurrent((c) => c + 1);
    }, [pushWrongObstacle, q, queue, current]);

  useEffect(() => {
    if (!started || showQuestion || questionCount === 0) return;
    if (current >= queue.length || !obstacles[current]) return;

    const tick = () => {
      setPosition((prev) => {
        const next = prev + MOVE_SPEED;
        const currentObstacle = obstacles[current];

        if (
          worldWidth > 0 &&
          currentObstacle > worldWidth - 120 &&
          next >= worldWidth - 120
        ) {
          shiftScreen();
          return 0;
        }

        if (next >= currentObstacle) {
          cancelAnimationFrame(rafRef.current);
          setShowQuestion(true);
          return currentObstacle;
        }

        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [showQuestion, current, started, obstacles, queue, questionCount, worldWidth, shiftScreen]);

  const advanceAfterAnswer = useCallback(
    (isCorrect: boolean) => {
      setTimeout(() => {
        setShowQuestion(false);
        setSelectedOption(null);
        setAnswerFeedback(null);
        if (!isCorrect) {
          setCurrent((c) => c + 1);
        } else {
          setCurrent((c) => c + 1);
        }
      }, isCorrect ? 450 : 650);
    },
    [],
  );

  const answer = (option: string) => {
    if (!q || selectedOption) return;

    setSelectedOption(option);
    const isCorrect = option === q.answer;

    setHistory((prev) => [
      ...prev,
      {
        questionIndex: queue[current] ?? 0,
        question: q.question,
        correctAnswer: q.answer,
        userAnswer: option,
        isCorrect,
      },
    ]);

    if (isCorrect) {
      setAnswerFeedback("correct");
      setDestroyBurst(current);
      setTimeout(() => setDestroyBurst(null), 600);

      const copy = [...destroyed];
      copy[current] = true;
      setDestroyed(copy);
      setCorrectCount((c) => c + 1);
      advanceAfterAnswer(true);
    } else {
      setAnswerFeedback("wrong");
      setLives((l) => l - 1);
      setHurt(true);
      setJump(true);
      setTimeout(() => {
        setJump(false);
        setHurt(false);
      }, 500);
      pushWrongObstacle();
      advanceAfterAnswer(false);
    }
  };

  const handleRestart = () => {
    cancelAnimationFrame(rafRef.current);
    setStarted(false);
    setShowQuestion(false);
    setDestroyBurst(null);
    setSelectedOption(null);
    setAnswerFeedback(null);
  };

  const handleSaveAndExit = async () => {
    if (!lessonId || questionCount === 0) {
      navigate(backUrl);
      return;
    }

    const scorePct = Math.round((correctCount / questionCount) * 100);
    const passed = scorePct >= passingScore;

    if (passed) {
      setSavingProgress(true);
      try {
        await lessonProgressApi.upsert({
          lessonId,
          quizBestScore: scorePct,
          quizPassed: true,
          quizAttempts: 1,
          status: "completed",
          videoWatchedPct: 100,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setSavingProgress(false);
      }
    }
    navigate(backUrl);
  };

  if (loadState === "loading") {
    return (
      <div className="game game--centered">
        <Loader2 className="game-spinner" size={40} />
        <p>Đang tải câu hỏi quiz...</p>
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <div className="game game--centered">
        <p className="game-error">{loadError}</p>
        <button type="button" className="actionBtn" onClick={() => navigate(backUrl)}>
          Quay lại
        </button>
      </div>
    );
  }

  if (lives <= 0 && started) {
    return (
      <div className="gameoverScreen">
        <h1>Trò chơi kết thúc</h1>
        <p>Bạn đã hết mạng. Hãy ôn lại và thử lại nhé!</p>
        <div className="actionButtons">
          <button type="button" className="actionBtn" onClick={handleRestart}>
            Chơi lại
          </button>
          <button type="button" className="actionBtn" onClick={() => navigate(backUrl)}>
            Về bài học
          </button>
        </div>
      </div>
    );
  }

  const allQuestionsAnswered = started && current >= queue.length && questionCount > 0;

  if (
    started &&
    questionCount > 0 &&
    lives > 0 &&
    (correctCount === questionCount || allQuestionsAnswered)
  ) {
    const scorePct = Math.round((correctCount / questionCount) * 100);
    const passed = scorePct >= passingScore;

    return (
      <div className="resultScreen">
        {!showHistory ? (
          <div className="resultContent">
            <div className="pixelSoldier">
              <div className="soldier">
                <img className="main" src={IMG.main} alt="" />
              </div>
            </div>
            <div className="resultInfo">
              <h2 className="resultTitle">{quizTitle}</h2>
              <div className="scoreBox">
                <div className="scoreItem">
                  <span className="scoreLabel">Tổng điểm</span>
                  <span className="scoreValue">
                    {correctCount}/{questionCount}
                  </span>
                </div>
                <div className="scoreItem">
                  <span className="scoreLabel">Thời gian</span>
                  <span className="scoreValue">{elapsedTime}</span>
                </div>
              </div>
              <div className="gradeBox">
                <span className="gradeLabel">Đánh giá</span>
                <span className="grade">{getGrade(correctCount, questionCount)}</span>
              </div>
              {!passed && (
                <p className="game-hint">
                  Cần đạt tối thiểu {passingScore}% để hoàn thành bài và mở khóa bài
                  tiếp theo.
                </p>
              )}
              <div className="actionButtons">
                <button type="button" className="actionBtn" onClick={handleRestart}>
                  Thử lại
                </button>
                <button
                  type="button"
                  className="actionBtn historyBtn"
                  onClick={() => setShowHistory(true)}
                >
                  Xem lịch sử
                </button>
                <button
                  type="button"
                  className="actionBtn nextBtn"
                  disabled={savingProgress}
                  onClick={() => void handleSaveAndExit()}
                >
                  {savingProgress
                    ? "Đang lưu..."
                    : passed
                      ? "Hoàn thành & về bài học"
                      : "Về bài học"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="historyContainer">
            <button type="button" className="backBtn" onClick={() => setShowHistory(false)}>
              ← Quay lại
            </button>
            <h2 className="historyTitle">Lịch sử trả lời</h2>
            <div className="historyList">
              {history.map((record, idx) => (
                <div
                  key={idx}
                  className={`historyItem ${record.isCorrect ? "correct" : "incorrect"}`}
                >
                  <div className="historyNumber">Câu {idx + 1}</div>
                  <div className="historyQuestion">{record.question}</div>
                  <div className="historyAnswers">
                    <div className="answerRow">
                      <span className="answerLabel">Đáp án đúng:</span>
                      <span className="correctAnswer">{record.correctAnswer}</span>
                    </div>
                    <div className="answerRow">
                      <span className="answerLabel">Bạn chọn:</span>
                      <span
                        className={`userAnswer ${record.isCorrect ? "correct" : "incorrect"}`}
                      >
                        {record.userAnswer}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`resultBadge ${record.isCorrect ? "correct" : "incorrect"}`}
                  >
                    {record.isCorrect ? "✓ Đúng" : "✗ Sai"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="game">
      {!started && (
        <>
          <button type="button" className="game-back-btn" onClick={() => navigate(backUrl)}>
            <ArrowLeft size={20} />
            Quay lại bài học
          </button>

          <h1 className="game-title">
            <Gamepad2 size={32} className="game-title-icon" />
            {quizTitle}
          </h1>
          <p className="game-subtitle">{questionCount} câu hỏi từ quiz bài học</p>

          <button type="button" className="startBtn" onClick={() => setStarted(true)}>
            Bắt đầu chơi
          </button>
        </>
      )}

      {started && (
        <>
          <div className="world game-world" ref={worldRef}>
            <div className="hearts">
              {Array.from({ length: lives }).map((_, i) => (
                <img key={i} src={IMG.heart} className="heart" alt="" />
              ))}
            </div>

            <div
              className={`character ${hurt ? "hurt" : ""}`}
              style={{ transform: `translate3d(${position}px, 0, 0)` }}
            >
              <div className={`character-sprite ${jump ? "jump" : ""}`}>
                <img className="main" src={IMG.main} alt="" />
              </div>
            </div>

            {obstacles.map((o, i) => (
              <div
                key={`${i}-${o}`}
                className={`obstacle ${destroyBurst === i ? "obstacle--burst" : ""} ${destroyed[i] ? "obstacle--cleared" : ""}`}
                style={{ transform: `translate3d(${o}px, 0, 0)` }}
              >
                {destroyed[i] ? (
                  <img className="block" src={IMG.unStumblingBlock} alt="" />
                ) : (
                  <img className="block" src={IMG.stumblingBlock} alt="" />
                )}
              </div>
            ))}
          </div>

          {showQuestion && q && current < queue.length && (
            <div className="questionOverlay questionOverlay--visible">
              <div className="questionCardWrapper">
                <div
                  className={`questionCard ${answerFeedback ? `questionCard--${answerFeedback}` : ""}`}
                >
                  <div className="progressOverlay">
                    <div className="progressBox">
                      <div className="progressRow">
                        <span className="progressLabel">Điểm</span>
                        <span className="progressNum">
                          {correctCount}/{questionCount}
                        </span>
                      </div>
                      <div className="progressRow">
                        <span className="progressLabel">Thời gian</span>
                        <span
                          className={`progressNum timer-display ${timer <= 5 ? "timer-display--danger" : ""}`}
                        >
                          {timer}s
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="questionImage">
                    <img src={IMG.bg} alt="" />
                  </div>

                  <h3 className="questionText">{q.question}</h3>

                  <div className="optionsContainer">
                    {q.options.map((o, idx) => (
                      <button
                        key={o}
                        type="button"
                        disabled={Boolean(selectedOption)}
                        className={`optionBtn ${selectedOption === o
                          ? answerFeedback === "correct"
                            ? "optionBtn--correct"
                            : answerFeedback === "wrong"
                              ? "optionBtn--wrong"
                              : ""
                          : ""
                          }`}
                        onClick={() => answer(o)}
                      >
                        <span className="optionLetter">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="optionText">{o}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
