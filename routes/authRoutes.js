import { Router } from "express";
import validateMiddleware from '../middleware/validation.js';
import authenticateMiddleware from '../middleware/authentication.js';
import AuthController from '../controllers/authController.js';

const router = Router();

const controller = new AuthController();
router.get('/users',
    authenticateMiddleware.checkUser, 
    validateMiddleware.users.isAdmin, 
    controller.getAllUsers)

router.get('/users/:userId',
    authenticateMiddleware.checkUser, 
    controller.getUser);

router.post('/register', 
    validateMiddleware.users.register, 
    controller.registerUser);

router.post('/login',
    validateMiddleware.users.login, 
    controller.loginUser);



export default router;