import express from 'express';
import { getMentorDashboard, replyDoubt } from '../controllers/mentorController.js';

const router = express.Router();

router.get('/dashboard', getMentorDashboard);
router.post('/reply-doubt', replyDoubt);

export default router;
