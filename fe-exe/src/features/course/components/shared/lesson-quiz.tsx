import { useState } from "react";
import type { LessonQuizDocument } from "../types";

type LessonQuizProps = {
  quiz: LessonQuizDocument;
  onSubmit: (result: {
    score: number;
    passed: boolean;
    attempts: number;
  }) => Promise<void>;
  previousBestScore?: number;
  alreadyPassed?: boolean;
};

export default function LessonQuiz({
  quiz,
  onSubmit,
  previousBestScore = 0,
  alreadyPassed = false,
}: LessonQuizProps) {
  const questions = quiz.questions ?? [];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
  } | null>(null);

  const handleSubmit = async () => {
    if (questions.length === 0) return;

    let correct = 0;
    for (const question of questions) {
      const qId = question._id ?? question.questionId ?? question.text;
      const selected = answers[String(qId)];
      const correctId = String(question.correctOptionId ?? "");
      if (selected && selected === correctId) correct += 1;
    }

    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= (quiz.passingScore ?? 70);

    setSubmitting(true);
    try {
      await onSubmit({ score, passed, attempts: 1 });
      setResult({ score, passed });
    } finally {
      setSubmitting(false);
    }
  };

  if (questions.length === 0) {
    return (
      <p className="text-gray-500 py-8 text-center">
        Quiz chưa có câu hỏi.
      </p>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-10">
      <div>
        <h3 className="text-2xl font-bold text-[#5c3a21]">{quiz.title}</h3>
        <p className="text-sm text-gray-500 mt-1">
          Điểm đạt: {quiz.passingScore ?? 70}%
          {previousBestScore > 0 && ` • Điểm cao nhất: ${previousBestScore}%`}
        </p>
        {alreadyPassed && (
          <p className="text-sm text-emerald-600 font-semibold mt-2">
            Bạn đã hoàn thành quiz này ✓
          </p>
        )}
      </div>

      {questions.map((question, index) => {
        const qId = String(
          question._id ?? question.questionId ?? `q-${index}`,
        );
        return (
          <div
            key={qId}
            className="rounded-2xl border border-[#5c3a21]/10 bg-white p-5 shadow-sm"
          >
            <p className="font-semibold text-gray-800 mb-4">
              {index + 1}. {question.text}
            </p>
            <div className="space-y-2">
              {(question.options ?? []).map((option) => {
                const optionId = String(option._id ?? option.text);
                return (
                  <label
                    key={optionId}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                      answers[qId] === optionId
                        ? "border-[#5c3a21] bg-[#5c3a21]/5"
                        : "border-gray-200 hover:border-[#5c3a21]/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name={qId}
                      value={optionId}
                      checked={answers[qId] === optionId}
                      onChange={() =>
                        setAnswers((prev) => ({ ...prev, [qId]: optionId }))
                      }
                      className="accent-[#5c3a21]"
                    />
                    <span className="text-sm text-gray-700">{option.text}</span>
                  </label>
                );
              })}
            </div>
            {result && question.explanation && (
              <p className="mt-3 text-xs text-gray-500 italic">
                {question.explanation}
              </p>
            )}
          </div>
        );
      })}

      {result ? (
        <div
          className={`rounded-2xl p-5 text-center font-bold ${
            result.passed
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {result.passed
            ? `Chúc mừng! Bạn đạt ${result.score}% — bài tiếp theo đã được mở khóa.`
            : `Bạn đạt ${result.score}%. Cần ít nhất ${quiz.passingScore ?? 70}% để qua bài.`}
        </div>
      ) : (
        <button
          type="button"
          disabled={
            submitting ||
            questions.some((q, i) => !answers[String(q._id ?? q.questionId ?? `q-${i}`)])
          }
          onClick={() => void handleSubmit()}
          className="w-full rounded-xl bg-[#5c3a21] py-3 text-white font-bold hover:bg-[#4a2e1a] disabled:opacity-60 transition-colors"
        >
          {submitting ? "Đang nộp..." : "Nộp bài quiz"}
        </button>
      )}
    </div>
  );
}

