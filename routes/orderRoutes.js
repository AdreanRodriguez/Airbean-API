import { Router } from 'express';

import validateMiddleware from '../middleware/validation.js';
import authMiddleware from '../middleware/authentication.js';
import OrderController from '../controllers/orderController.js';
import authentication from '../middleware/authentication.js';

const router = Router();
const controller = new OrderController();

// URL = POST /api/orders
router.get('/',
    validateMiddleware.users.isAdmin,
    validateMiddleware.orders.many,
    controller.getAllHistory);

//Hämta historik för specifik användare
router.get('/history',
    authentication.verifyToken,
    validateMiddleware.orders.many,
    controller.getHistoryByUserId);


router.get('/admin/history',
    authentication.verifyToken,
    validateMiddleware.users.isAdmin,
    validateMiddleware.orders.many,
    controller.getHistoryByUserId);


router.get('/:orderId',
    validateMiddleware.orders.one,
    controller.getOrderById);


router.get('/:orderId/place',
    validateMiddleware.orders.oneStrict,
    authMiddleware.checkUser,
    controller.placeOrder);


router.get('/:orderId/estimatedTimeLeft',
    validateMiddleware.orders.oneStrict,
    authMiddleware.checkUser,
    validateMiddleware.orders.userIdInsideOrder,
    controller.getEstimatedTimeLeft);

// Hämtar den varukorg som användaren har aktiv. 
// Om det inte finns en aktiv varukorg så skapas en tom.
router.post('/:productId',
    validateMiddleware.orders.one,
    authMiddleware.checkUser,
    validateMiddleware.products.one,
    controller.addProduct);


router.delete('/:productId',
    validateMiddleware.orders.oneStrict,
    authMiddleware.checkUser,
    validateMiddleware.products.one,
    controller.removeProduct);


export default router;