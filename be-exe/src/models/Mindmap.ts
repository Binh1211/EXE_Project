import mongoose, { Schema } from "mongoose";

const mindmapItemSchema = new Schema({
  label: { type: String },
  content: { type: String, required: true },
  icon: { type: String },
}, { _id: false });

const mindmapTopicSchema = new Schema({
  title: { type: String, required: true },
  illustrationUrl: { type: String },
  items: [mindmapItemSchema],
}, { _id: false });

const mindmapSectionSchema = new Schema({
  title: { type: String, required: true },
  layoutType: { type: String, enum: ["rect", "scroll"], default: "rect" },
  topics: [mindmapTopicSchema],
}, { _id: false });

const mindmapSchema = new Schema({
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
    index: true,
    unique: true,
  },
  title: { type: String, required: true },
  sections: [mindmapSectionSchema],
}, { timestamps: true });

export const Mindmap = mongoose.model("Mindmap", mindmapSchema);
export type IMindmap = mongoose.InferSchemaType<typeof mindmapSchema>;
