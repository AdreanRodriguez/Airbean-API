import { Router } from "express";
import validateMiddleware from '../middleware/validation.js';
import authenticateMiddleware from '../middleware/authentication.js';
import AuthController from '../controllers/authController.js';

const router = Router();

const controller = new AuthController();

router.post('/login',
    validateMiddleware.users.login,
    controller.loginUser);

router.post('/register',
    validateMiddleware.users.register,
    controller.registerUser);

router.get('/users',
    authenticateMiddleware.checkUser,
    validateMiddleware.users.isAdmin,
    controller.getAllUsers);
// GET - /api/auth/users/:userId
router.get('/users/:userId',
    authenticateMiddleware.checkUserStrict,
    validateMiddleware.users.isAdmin,
    validateMiddleware.users.validUserIdParam,
    controller.getUser);


export default router;