import type { LessonQuizDocument } from "@/features/course/types";

export type GameQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
};

export function mapQuizToGameQuestions(
  quiz: LessonQuizDocument | null | undefined,
): GameQuestion[] {
  if (!quiz?.questions?.length) return [];

  return quiz.questions
    .map((q, index) => {
      const options = (q.options ?? []).map((o) => o.text.trim()).filter(Boolean);
      const correct = q.options?.find(
        (o) => String(o._id) === String(q.correctOptionId),
      );
      const answer = correct?.text?.trim() ?? "";

      return {
        id: String(q._id ?? q.questionId ?? index),
        question: q.text.trim(),
        options,
        answer,
        explanation: q.explanation,
      };
    })
    .filter((q) => q.question && q.options.length >= 2 && q.answer);
}
