import { Router } from 'express';

import { aboutInfo } from '../controllers/aboutController.js';
import validateMiddleware from '../middleware/validation.js';

const router = Router();

router.get('/',validateMiddleware.about, aboutInfo);

export default router;