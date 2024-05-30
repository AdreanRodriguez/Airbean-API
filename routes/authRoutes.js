import { Router } from "express";
import {validateRegistration} from '../middleware/validateInput.js';
import AuthController from '../controllers/authController.js';

const router = Router();

const auth = new AuthController();
router.post('/register', validateRegistration, auth.registerUser);

router.post('/login', auth.loginUser);

router.get('/:userId', auth.getUser);

export default router;