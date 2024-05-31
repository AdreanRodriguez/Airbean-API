import { Router } from 'express';
import validateProduct from '../middleware/validateProduct.js';
import ProductController from './../controllers/productController.js';

const router = Router();

const controller = new ProductController();

router.get('/', controller.getAllProducts);

router.get('/:productId', validateProduct, controller.getProduct);

export default router;

