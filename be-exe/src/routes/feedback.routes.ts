import { Router } from 'express';
import { createFeedback, checkSubmitted, getAllFeedbacks } from '../controllers/feedback.controller.js';

const router = Router();

router.get('/check', checkSubmitted);
router.get('/', getAllFeedbacks);
router.post('/', createFeedback);

export default router;
