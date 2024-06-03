import { Router } from "express";
import validateMiddleware from '../middleware/validation.js';
import AuthController from '../controllers/authController.js';

const router = Router();

const auth = new AuthController();
router.post('/register', validateMiddleware.users.register, auth.registerUser);

router.post('/login',validateMiddleware.users.login, auth.loginUser);

router.get('/:userId', auth.getUser);

export default router;