import { Router } from "express";
import {
  createFlashcardSetHandler,
  deleteFlashcardSetHandler,
  getFlashcardSet,
  listFlashcardSets,
  updateFlashcardSetHandler,
} from "../controllers/flashcard-set.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

router.get("/", asyncHandler(listFlashcardSets));
router.get("/:id", asyncHandler(getFlashcardSet));
router.post("/", asyncHandler(createFlashcardSetHandler));
router.put("/:id", asyncHandler(updateFlashcardSetHandler));
router.delete("/:id", asyncHandler(deleteFlashcardSetHandler));

export default router;
