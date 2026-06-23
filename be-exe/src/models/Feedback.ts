import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
  userId?: string;
  role: string;
  uiRating: number;
  uiInteraction: string;
  techIssues: string;
  contentMindmap: string;
  contentLength: string;
  gamificationRating: number;
  favoriteFeatures: string[];
  nps: number;
  improvements: string[];
  generalFeedback: string;
  createdAt: Date;
}

const FeedbackSchema: Schema = new Schema(
  {
    userId: { type: String, index: true }, // optional - link to user account
    role: { type: String, required: true },
    uiRating: { type: Number, required: true, min: 1, max: 5 },
    uiInteraction: { type: String, required: true },
    techIssues: { type: String, required: true },
    contentMindmap: { type: String, required: true },
    contentLength: { type: String, required: true },
    gamificationRating: { type: Number, required: true, min: 1, max: 5 },
    favoriteFeatures: { type: [String], required: true },
    nps: { type: Number, required: true, min: 1, max: 5 },
    improvements: { type: [String], required: true },
    generalFeedback: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema);
export default Feedback;
