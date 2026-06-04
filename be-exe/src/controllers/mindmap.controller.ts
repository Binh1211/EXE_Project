import type { Response, Request } from "express";
import { Mindmap } from "../models/Mindmap.js";
import mongoose from "mongoose";

export async function getMindmapByLesson(req: Request, res: Response): Promise<void> {
  try {
    const lessonIdParam = req.params.lessonId;
    const lessonId = Array.isArray(lessonIdParam) ? lessonIdParam[0] : lessonIdParam;

    if (!lessonId || !mongoose.Types.ObjectId.isValid(lessonId)) {
      res.status(400).json({ message: "ID bài học không hợp lệ." });
      return;
    }
    const mindmap = await Mindmap.findOne({ lessonId });
    if (!mindmap) {
      res.status(404).json({ message: "Không tìm thấy sơ đồ tư duy cho bài học này." });
      return;
    }
    res.json(mindmap);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
