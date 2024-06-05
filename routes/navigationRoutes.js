import { Router } from 'express';

import validateMiddleware from '../middleware/validation.js';
import NavigationController from '../controllers/navigationController.js';

const router = Router();
const controller = new NavigationController();

router.get('/', validateMiddleware.navigation, controller.getAll);

export default router;