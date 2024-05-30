import {productDb as db} from '../models/productModel.js';
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
    const products = await db.find({}).sort({ id: 1 });
    res.json(products);
});

export default router;
    
