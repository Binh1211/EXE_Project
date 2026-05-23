import { Router } from "express";
import {
  createFaqItemHandler,
  deleteFaqItemHandler,
  getFaqItem,
  listFaqItems,
  updateFaqItemHandler,
} from "../controllers/faq.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

router.get("/", asyncHandler(listFaqItems));
router.get("/:id", asyncHandler(getFaqItem));
router.post("/", asyncHandler(createFaqItemHandler));
router.put("/:id", asyncHandler(updateFaqItemHandler));
router.delete("/:id", asyncHandler(deleteFaqItemHandler));

export default router;
