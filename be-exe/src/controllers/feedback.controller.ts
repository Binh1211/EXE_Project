import { Request, Response } from 'express';
import Feedback from '../models/Feedback.js';

// GET /api/feedbacks - Admin: list all feedbacks
export const getAllFeedbacks = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const [feedbacks, total] = await Promise.all([
      Feedback.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Feedback.countDocuments(),
    ]);
    return res.json({ success: true, data: feedbacks, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const createFeedback = async (req: Request, res: Response) => {
  try {
    const feedback = new Feedback(req.body);
    const savedFeedback = await feedback.save();
    res.status(201).json({ success: true, data: savedFeedback });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /api/feedbacks/check?userId=xxx
// Returns whether the given userId has already submitted a feedback
export const checkSubmitted = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ success: false, message: 'userId is required' });
    }
    const existing = await Feedback.findOne({ userId }).select('_id').lean();
    return res.json({ success: true, submitted: !!existing });
  } catch (error) {
    console.error('Error checking feedback:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
