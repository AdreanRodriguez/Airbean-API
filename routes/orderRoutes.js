import { Router } from 'express';

import validateMiddleware from '../middleware/validation.js';
import authMiddleware from '../middleware/authentication.js';
import OrderController from '../controllers/orderController.js';

const router = Router();
const controller = new OrderController();

// URL = GET /api/orders, header: {authorization}
router.get('/',
    authMiddleware.checkUserStrict,
    validateMiddleware.users.isAdmin,
    validateMiddleware.orders.many,
    controller.getAllHistory);

//Hämta historik för specifik användare
// URL = GET /api/orders/history, header: {authorization}
router.get('/history',
    authMiddleware.checkUserStrict,
    validateMiddleware.orders.history,
    controller.getHistoryByUserId);

// URL = GET /api/orders/history, header: {authorization}
router.get('/:orderId',
    validateMiddleware.orders.oneStrict,
    controller.getOrderById);

// URL = GET /api/orders/:orderId/place, header: {authorization}
router.get('/:orderId/place',
    validateMiddleware.orders.oneStrict,
    authMiddleware.checkUser,
    validateMiddleware.orders.userIdInsideOrder,
    validateMiddleware.orders.isOrderPlaced,
    controller.placeOrder);

// URL = GET /api/orders/:orderId/estimatedTimeLeft, header: {authorization}
router.get('/:orderId/estimatedTimeLeft',
    validateMiddleware.orders.oneStrict,
    authMiddleware.checkUser,
    validateMiddleware.orders.userIdInsideOrder,
    validateMiddleware.orders.isOrderNotPlaced,
    controller.getEstimatedTimeLeft);

// Hämtar den varukorg som användaren har aktiv. 
// Om det inte finns en aktiv varukorg så skapas en tom.
// URL = POST /api/orders/:productId, body: {orderId, amount?}, header: {authorization}
router.post('/:productId',
    authMiddleware.checkUser,
    validateMiddleware.orders.one,
    validateMiddleware.products.one,
    validateMiddleware.orders.userIdInsideOrder,
    controller.addProduct);

// URL = DELETE /api/orders/:productId, body: {orderId, amount?}, header: {authorization}
router.delete('/:productId',
    validateMiddleware.orders.oneStrict,
    authMiddleware.checkUser,
    validateMiddleware.products.one,
    validateMiddleware.orders.userIdInsideOrder,
    controller.removeProduct);


export default router;