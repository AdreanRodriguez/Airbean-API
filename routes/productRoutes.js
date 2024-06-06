import { Router } from 'express';

import validateMiddleware from '../middleware/validation.js';
import ProductController from './../controllers/productController.js';

const router = Router();

const controller = new ProductController();

router.get('/', validateMiddleware.products.many, controller.getAllProducts);

router.get('/:productId', validateMiddleware.products.one, controller.getProduct);

export default router;

