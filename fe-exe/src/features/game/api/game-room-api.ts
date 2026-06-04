import { apiRequest } from "@/lib/api-client";
import type { DragonRaceRoom } from "../types/dragon-race";

const PREFIX = "/api/game-rooms";

export const gameRoomApi = {
  createRoom(quizId: string) {
    return apiRequest<{ roomCode: string }>(PREFIX, {
      method: "POST",
      body: JSON.stringify({ quizId }),
    });
  },

  getRoom(roomCode: string) {
    return apiRequest<DragonRaceRoom>(`${PREFIX}/${roomCode}`);
  },
};
