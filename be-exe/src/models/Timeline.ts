import mongoose, { Schema } from "mongoose";

const timelineSchema = new Schema({
  slug: {
    type: String,
    unique: true,
  },

  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },

  imageUrl: {
    type: String,
    required: true,
  },

  displayTime: {
    type: String,
    required: true,
  },
  chapters: [
    {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
    },
  ],
  order: {
    type: Number,
    required: true,
    index: true,
  },
}, { timestamps: true });

export const Timeline = mongoose.model("Timeline", timelineSchema);
