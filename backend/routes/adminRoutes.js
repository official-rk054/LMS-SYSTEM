import express from 'express';
import { getAdminDashboard, publishDrive } from '../controllers/adminController.js';

const router = express.Router();

router.get('/dashboard', getAdminDashboard);
router.post('/publish-drive', publishDrive);

export default router;
