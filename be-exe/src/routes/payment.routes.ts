import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { createHandler, deleteHandler, getHandler, listHandler, updateHandler } from "../controllers/payment.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(listHandler));
router.get("/:id", asyncHandler(getHandler));
router.post("/", asyncHandler(createHandler));
router.put("/:id", asyncHandler(updateHandler));
router.delete("/:id", asyncHandler(deleteHandler));

export default router;
