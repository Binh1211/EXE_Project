import { apiRequest } from "@/lib/api-client";

export interface CreateRoomRequest {
  title: string;
  timeLimitSec: number;
  questions: {
    text: string;
    imageUrl?: string;
    options: { text: string }[];
    correctOptionIndex: number;
    points?: number;
  }[];
}

export interface RoomParticipant {
  userId: string;
  displayName: string;
  score: number;
  timeTakenSec: number;
  submittedAt: string;
}

export interface FlashcardRoomData {
  _id: string;
  title: string;
  timeLimitSec: number;
  status: "active" | "closed";
  questions: {
    _id: string;
    text: string;
    imageUrl?: string;
    options: { text: string }[];
    points: number;
  }[];
}

export interface SubmitAnswersRequest {
  answers: { questionId: string; selectedIndex: number }[];
  timeTakenSec: number;
}

const PREFIX = "/api/flashcard-rooms";

export const flashcardRoomApi = {
  createRoom(payload: CreateRoomRequest) {
    return apiRequest<{ joinCode: string; message: string }>(`${PREFIX}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getRoom(code: string) {
    return apiRequest<FlashcardRoomData>(`${PREFIX}/${code}`);
  },

  submitAnswers(code: string, payload: SubmitAnswersRequest) {
    return apiRequest<{ score: number; totalPoints: number; timeTakenSec: number }>(
      `${PREFIX}/${code}/submit`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  getLeaderboard(code: string) {
    return apiRequest<{ title: string; status: string; leaderboard: RoomParticipant[] }>(
      `${PREFIX}/${code}/leaderboard`
    );
  },
};
