import { Router } from 'express';
import { aboutInfo } from '../controllers/aboutController.js';

const router = Router();

router.get('/', aboutInfo);

export default router;