import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Plus, Users } from "lucide-react";
import { quizApi } from "@/features/course/api/quiz-api";
import type { LessonQuizDocument } from "@/features/course/types";
import { getApiErrorMessage } from "@/lib/api-client";
import { gameRoomApi } from "../api/game-room-api";

export default function DragonRaceCreatePage() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<LessonQuizDocument[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    quizApi
      .getAllQuizzes()
      .then((items) => {
        const playable = items.filter((quiz) => (quiz.questions?.length ?? 0) > 0);
        setQuizzes(playable);
        setSelectedQuizId(playable[0]?._id ?? "");
      })
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const createRoom = async () => {
    if (!selectedQuizId) return;
    setSubmitting(true);
    setError("");
    try {
      const { roomCode } = await gameRoomApi.createRoom(selectedQuizId);
      navigate(`/game/dua-rong/lobby/${roomCode}`);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-[#fff6f4] px-8 py-10">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => navigate("/game/list")}
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#5c3a21]"
        >
          <ArrowLeft size={18} />
          Danh sách trò chơi
        </button>

        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[#5c3a21]">Tạo phòng Đua Rồng</h1>
            <p className="mt-2 text-sm text-gray-500">Chọn quiz có sẵn để tạo mã phòng.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/game/dua-rong/join")}
            className="inline-flex items-center gap-2 rounded-xl border border-[#5c3a21]/20 bg-white px-5 py-3 text-sm font-bold text-[#5c3a21]"
          >
            <Users size={18} />
            Nhập mã phòng
          </button>
        </div>

        <div className="rounded-2xl border border-[#5c3a21]/10 bg-white p-6 shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-[#5c3a21]">
              <Loader2 className="animate-spin" />
              Đang tải quiz...
            </div>
          ) : quizzes.length === 0 ? (
            <p className="py-16 text-center text-gray-500">Chưa có quiz nào đủ câu hỏi.</p>
          ) : (
            <div className="grid gap-3">
              {quizzes.map((quiz) => (
                <button
                  key={quiz._id}
                  type="button"
                  onClick={() => setSelectedQuizId(quiz._id)}
                  className={`rounded-xl border p-4 text-left transition ${
                    selectedQuizId === quiz._id
                      ? "border-[#5c3a21] bg-[#5c3a21]/5"
                      : "border-gray-200 hover:border-[#5c3a21]/40"
                  }`}
                >
                  <p className="font-bold text-[#5c3a21]">{quiz.title}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {quiz.questions?.length ?? 0} câu hỏi
                  </p>
                </button>
              ))}
            </div>
          )}

          {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <button
            type="button"
            disabled={!selectedQuizId || submitting}
            onClick={() => void createRoom()}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#5c3a21] px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {submitting ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            Tạo phòng
          </button>
        </div>
      </div>
    </div>
  );
}
