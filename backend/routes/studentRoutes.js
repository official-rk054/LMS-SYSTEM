import express from 'express';
import {
  getStudentDashboard,
  applyDrive,
  getApplications,
  submitCoding,
  submitAssessment,
  submitInterview
} from '../controllers/studentController.js';

const router = express.Router();

router.get('/dashboard', getStudentDashboard);
router.post('/apply', applyDrive);
router.get('/applications', getApplications);
router.post('/coding-submission', submitCoding);
router.post('/assessment-submission', submitAssessment);
router.post('/interview-session', submitInterview);

export default router;

