import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./Game.css";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

type AnswerRecord = {
  questionIndex: number;
  question: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
};

const questions: Question[] = [
  {
    question: "Việt Nam tuyên bố độc lập năm nào?",
    options: ["1930", "1945", "1954", "1975"],
    answer: "1945",
  },
  {
    question: "Chiến tranh thế giới II bắt đầu năm nào?",
    options: ["1914", "1939", "1941", "1945"],
    answer: "1939",
  },
  {
    question: "Chiến thắng Điện Biên Phủ năm nào?",
    options: ["1945", "1954", "1968", "1975"],
    answer: "1954",
  },
];

const getGrade = (correctCount: number, totalQuestions: number): string => {
  const percentage = (correctCount / totalQuestions) * 100;
  if (percentage === 100) return "A+";
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B+";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  return "F";
};

export default function App() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [position, setPosition] = useState(0);
  const [current, setCurrent] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [lives, setLives] = useState(3);
  const [jump, setJump] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [queue, setQueue] = useState<number[]>([]);
  const [obstacles, setObstacles] = useState<number[]>([]);
  const [destroyed, setDestroyed] = useState<boolean[]>([]);
  const [timer, setTimer] = useState(15);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<string>("0:00");
  const [history, setHistory] = useState<AnswerRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const MAX_OBSTACLES = 6;

  useEffect(() => {
    if (!started) return;

    const initialObstacles = questions.map((_, i) => 200 + i * 200);

    setQueue(questions.map((_, i) => i));
    setObstacles(initialObstacles);
    setDestroyed(new Array(questions.length).fill(false));
    setStartTime(Date.now());
  }, [started]);

  // Timer for questions
  useEffect(() => {
    if (!showQuestion) return;

    setTimer(15);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          // Time's up, treat as wrong answer
          const currentQuestionIndex = queue[current];
          if (currentQuestionIndex !== undefined) {
            setLives((l) => l - 1);
            setJump(true);
            setTimeout(() => setJump(false), 400);
            setQueue((prev) => [...prev, currentQuestionIndex]);
            setObstacles((prev) => {
              let next = [...prev, prev[prev.length - 1] + 200];
              if (next.length > MAX_OBSTACLES) {
                next = next.slice(0, MAX_OBSTACLES);
                next = next.slice(1).map((v) => v - 200);
                setPosition((p) => p - 200);
                setCurrent((c) => c - 1);
              }
              return next;
            });
            setDestroyed((prev) => {
              let next = [...prev, false];
              if (next.length > MAX_OBSTACLES) next = next.slice(1);
              return next;
            });
          }
          setShowQuestion(false);
          setCurrent((c) => c + 1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showQuestion, current, queue]);

  // Elapsed time counter
  useEffect(() => {
    if (!started || correctCount === questions.length) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      setElapsedTime(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    }, 100);

    return () => clearInterval(interval);
  }, [started, startTime, correctCount]);

  const currentQuestionIndex = queue[current];
  const q =
    currentQuestionIndex !== undefined ? questions[currentQuestionIndex] : null;

  useEffect(() => {
    if (!started || showQuestion) return;
    if (current >= queue.length) return;
    if (!obstacles[current]) return;

    const timer = setInterval(() => {
      setPosition((prev) => {
        const next = prev + 5;

        if (next >= obstacles[current]) {
          clearInterval(timer);
          setShowQuestion(true);
        }

        return next;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [showQuestion, current, started, obstacles, queue]);

  const answer = (option: string) => {
    if (!q) return;

    const isCorrect = option === q.answer;
    const currentQuestionIndex = queue[current];
    const newRecord: AnswerRecord = {
      questionIndex: currentQuestionIndex,
      question: q.question,
      correctAnswer: q.answer,
      userAnswer: option,
      isCorrect: isCorrect,
    };
    setHistory((prev) => [...prev, newRecord]);

    if (isCorrect) {
      const copy = [...destroyed];
      copy[current] = true;
      setDestroyed(copy);

      setCorrectCount((c) => c + 1);
    } else {
      setLives((l) => l - 1);

      setJump(true);
      setTimeout(() => setJump(false), 400);

      setQueue((prev) => [...prev, currentQuestionIndex]);

      setObstacles((prev) => {
        let next = [...prev, prev[prev.length - 1] + 200];

        if (next.length > MAX_OBSTACLES) {
          next = next.slice(0, MAX_OBSTACLES);
          next = next.slice(1).map((v) => v - 200);

          // dịch map
          setPosition((p) => p - 200);

          // rất quan trọng
          setCurrent((c) => c - 1);
        }

        return next;
      });

      setDestroyed((prev) => {
        let next = [...prev, false];
        if (next.length > MAX_OBSTACLES) next = next.slice(1);
        return next;
      });
    }

    setShowQuestion(false);
    setCurrent((c) => c + 1);
  };

  const handleRestart = () => {
    setStarted(false);
    setPosition(0);
    setCurrent(0);
    setShowQuestion(false);
    setLives(3);
    setJump(false);
    setCorrectCount(0);
    setQueue([]);
    setObstacles([]);
    setDestroyed([]);
    setTimer(15);
    setElapsedTime("0:00");
    setHistory([]);
    setShowHistory(false);
  };

  const handleGameOver = () => {
    return (
      <div className="gameoverScreen">
        <h1>Trò chơi kết thúc</h1>
        <p>Bạn mất tất cả các mạng sống!</p>
        <button className="actionBtn" onClick={handleRestart}>
          Chơi lại
        </button>
      </div>
    );
  };

  if (lives <= 0) return handleGameOver();

  if (started && correctCount === questions.length && lives > 0) {
    return (
      <div className="resultScreen">
        {!showHistory ? (
          <div className="resultContent">
            <div className="pixelSoldier">
              <div className="soldier">
                <img className="main" src="/img/main.jpg" />
              </div>
            </div>
            <div className="resultInfo">
              <h2 className="resultTitle">Kết quả</h2>
              <div className="scoreBox">
                <div className="scoreItem">
                  <span className="scoreLabel">Tổng điểm</span>
                  <span className="scoreValue">
                    {correctCount}/{questions.length}
                  </span>
                </div>
                <div className="scoreItem">
                  <span className="scoreLabel">Thời gian làm bài</span>
                  <span className="scoreValue">{elapsedTime}</span>
                </div>
              </div>
              <div className="gradeBox">
                <span className="gradeLabel">Đánh giá</span>
                <span className="grade">
                  {getGrade(correctCount, questions.length)}
                </span>
              </div>
              <div className="actionButtons">
                <button className="actionBtn nextBtn" onClick={handleRestart}>
                  Thử lại
                </button>
                <button
                  className="actionBtn historyBtn"
                  onClick={() => setShowHistory(true)}
                >
                  Xem lịch sử
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="historyContainer">
            <button className="backBtn" onClick={() => setShowHistory(false)}>
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
                      <span className="correctAnswer">
                        {record.correctAnswer}
                      </span>
                    </div>
                    <div className="answerRow">
                      <span className="answerLabel">Đáp án của bạn:</span>
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
      <button
        className="game-back-btn"
        onClick={() => navigate(`/course/${id}/learning`)}
      >
        <ArrowLeft size={20} />
        Quay lại khóa học
      </button>

      <h1>History Mini Game</h1>

      {!started && (
        <button className="startBtn" onClick={() => setStarted(true)}>
          Start Game
        </button>
      )}

      {started && (
        <>
          <div className="world">
            <div className="hearts">
              {Array.from({ length: lives }).map((_, i) => (
                <img key={i} src="/img/heart.jpg" className="heart" />
              ))}
            </div>

            <div
              className={`character ${jump ? "jump" : ""}`}
              style={{ left: position }}
            >
              <img className="main" src="/img/main.jpg" />
            </div>

            {obstacles.map((o, i) => (
              <div key={i} className="obstacle" style={{ left: o }}>
                {destroyed[i] ? (
                  <img className="block" src="/img/un_stumbling_block.jpg" />
                ) : (
                  <img className="block" src="/img/stumbling_block.jpg" />
                )}
              </div>
            ))}
          </div>

          {showQuestion && q && current < queue.length && (
            <div className="questionOverlay">
              <div className="questionCardWrapper">
                <div className="questionCard">
                  <div className="progressOverlay">
                    <div className="progressBox">
                      <div className="progressRow">
                        <span className="progressLabel">Điểm</span>
                        <span className="progressNum">{correctCount}/{questions.length}</span>
                      </div>
                      <div className="progressRow">
                        <span className="progressLabel">Thời gian</span>
                        <span className="progressNum">{timer}s</span>
                      </div>
                    </div>
                  </div>

                  <div className="questionImage">
                    <img src="/img/bg.jpg" alt="question" />
                  </div>

                  <h3 className="questionText">{q.question}</h3>

                  <div className="optionsContainer">
                    {q.options.map((o, idx) => (
                      <button
                        key={o}
                        className="optionBtn"
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