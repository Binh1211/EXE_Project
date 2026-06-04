import mongoose, { Schema } from "mongoose";

const playerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: String,
    score: {
      type: Number,
      default: 0,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    finishedAt: Date,
    isReady: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const gameRoomSchema = new Schema(
  {
    roomCode: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    hostId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quizId: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    status: {
      type: String,
      enum: ["waiting", "countdown", "playing", "finished"],
      default: "waiting",
    },
    maxPlayers: {
      type: Number,
      default: 4,
    },
    currentQuestionIndexForPlayers: [
      {
        type: Number,
        default: 0,
      },
    ],
    startedAt: Date,
    endedAt: Date,
    players: [playerSchema],
  },
  { timestamps: true },
);

export const GameRoom = mongoose.model("GameRoom", gameRoomSchema);
