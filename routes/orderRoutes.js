import { Router } from 'express';

import { validateOrder, validateOrderStrict } from '../middleware/validateOrder.js';
import validateProduct from '../middleware/validateProduct.js';

import OrderController from '../controllers/orderController.js';

const router = Router();
const controller = new OrderController();
// URL = POST /api/orders
router.post('/',);

router.get('/:orderId', validateOrderStrict, controller.getOrder);

router.get('/:orderId/place', validateOrderStrict, controller.placeOrder);

// Hämtar den varukorg som användaren har aktiv. 
// Om det inte finns en aktiv varukorg så skapas en tom.
router.post('/:productId', validateOrder, validateProduct, controller.addProduct);

router.delete('/:productId', validateOrderStrict, validateProduct, controller.removeProduct);


export default router;