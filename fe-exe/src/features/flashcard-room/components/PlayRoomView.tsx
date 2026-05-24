import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { flashcardRoomApi, type FlashcardRoomData } from "../api/flashcard-room-api";
import { Clock, AlertCircle } from "lucide-react";

export default function PlayRoomView() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<FlashcardRoomData | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadRoom() {
      try {
        const data = await flashcardRoomApi.getRoom(code!);
        if (data.status !== "active") {
          setError("Phòng thi này đã đóng.");
          setIsLoading(false);
          return;
        }
        setRoom(data);
        setTimeLeft(data.timeLimitSec);
      } catch (err: any) {
        setError(err.message || "Không thể tải phòng thi.");
      } finally {
        setIsLoading(false);
      }
    }
    loadRoom();
  }, [code]);

  useEffect(() => {
    if (timeLeft === null || isSubmitting || !room) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitting, room]);

  const handleSubmit = async () => {
    if (!room || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const timeTaken = room.timeLimitSec - (timeLeft || 0);
      const answerPayload = Object.entries(answers).map(([qId, sIdx]) => ({
        questionId: qId,
        selectedIndex: sIdx,
      }));

      await flashcardRoomApi.submitAnswers(code!, {
        answers: answerPayload,
        timeTakenSec: timeTaken,
      });

      navigate(`/flashcard-rooms/${code}/leaderboard`);
    } catch (err: any) {
      setError(err.message || "Lỗi khi nộp bài");
      setIsSubmitting(false);
    }
  };

  const handleSelectOption = (index: number) => {
    if (!room) return;
    const currentQ = room.questions[currentQIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQ._id]: index,
    }));
  };

  if (isLoading) return <div className="text-center py-20">Đang tải phòng thi...</div>;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-red-50 text-red-600 p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Không thể tham gia</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate("/flashcard-rooms/join")}
            className="mt-6 px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!room) return null;

  const currentQ = room.questions[currentQIndex];
  const selectedIndex = answers[currentQ._id];
  const isLastQuestion = currentQIndex === room.questions.length - 1;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl font-bold text-[#5f3713]">{room.title}</h1>
          <p className="text-sm text-gray-500">Mã phòng: {code}</p>
        </div>
        <div className="flex items-center gap-2 text-xl font-mono font-bold text-[#d87c32] bg-orange-50 px-4 py-2 rounded-xl">
          <Clock className="w-5 h-5" />
          {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2 font-medium">
          <span>Câu {currentQIndex + 1} / {room.questions.length}</span>
          <span>{Object.keys(answers).length} đã làm</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#d87c32] transition-all duration-300"
            style={{ width: `${((currentQIndex + 1) / room.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 leading-relaxed">
          {currentQ.text}
        </h2>
        {currentQ.imageUrl && (
          <img
            src={currentQ.imageUrl}
            alt="Question"
            className="w-full max-h-[300px] object-cover rounded-xl mb-6"
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQ.options.map((opt, index) => {
            const isSelected = selectedIndex === index;
            return (
              <button
                key={index}
                onClick={() => handleSelectOption(index)}
                className={`text-left px-6 py-4 rounded-xl border-2 transition-all duration-200 text-lg font-medium
                  ${isSelected 
                    ? "border-[#d87c32] bg-[#f9f5ed] text-[#5f3713] shadow-md shadow-[#d87c32]/10" 
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                  }`}
              >
                {opt.text}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Nav */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentQIndex === 0}
          className="px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition"
        >
          Câu trước
        </button>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 bg-[#d87c32] text-white rounded-xl font-semibold hover:bg-[#b86725] transition shadow-lg shadow-[#d87c32]/20"
          >
            {isSubmitting ? "Đang nộp..." : "Nộp bài"}
          </button>
        ) : (
          <button
            onClick={() => setCurrentQIndex((prev) => Math.min(room.questions.length - 1, prev + 1))}
            className="px-8 py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition"
          >
            Câu sau
          </button>
        )}
      </div>
    </div>
  );
}
