import { Router } from 'express';

import validateMiddleware from '../middleware/validation.js';

import OrderController from '../controllers/orderController.js';

const router = Router();
const controller = new OrderController();
// URL = POST /api/orders
router.post('/',);

router.get('/:orderId', validateMiddleware.orders.one, controller.getOrder);

router.get('/:orderId/place', validateMiddleware.orders.oneStrict, controller.placeOrder);

// Hämtar den varukorg som användaren har aktiv. 
// Om det inte finns en aktiv varukorg så skapas en tom.
router.post('/:productId', validateMiddleware.orders.one, validateMiddleware.products.one, controller.addProduct);

router.delete('/:productId', validateMiddleware.orders.oneStrict, validateMiddleware.products.one, controller.removeProduct);


export default router;