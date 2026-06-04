export type DragonRaceRoomStatus = "waiting" | "countdown" | "playing" | "finished";

export type DragonRacePlayer = {
  userId: string;
  username: string;
  score: number;
  correctAnswers: number;
  isReady: boolean;
  position?: number;
};

export type DragonRaceRoom = {
  id: string;
  roomCode: string;
  hostId: string;
  quizId: string;
  status: DragonRaceRoomStatus;
  maxPlayers: number;
  currentQuestionIndexForPlayers: number[];
  players: DragonRacePlayer[];
};

export type DragonRaceQuestion = {
  questionId: string;
  index: number;
  total: number;
  text: string;
  imageUrl?: string;
  options: {
    id: string;
    text: string;
  }[];
  timeLimit: number;
};

export type DragonRaceLeaderboardItem = {
  rank: number;
  userId: string;
  name: string;
  score: number;
  correctAnswers: number;
};
