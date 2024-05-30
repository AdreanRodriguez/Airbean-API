import {productDb as db} from '../models/productModel.js'

export default class ProductController{
    // URL =  api/products
    //ALLA PRODUKTER
    getProducts = async (req, res) => {
        const products = await db.find().sort({ id: 1 });
        res.status(200).json({
            success: true,
            message: 'Products found.',
            status: 200,
            products: products
        });
    }
    // ENSKILD PRODUKT PÅ ID
    // URL =  api/products/:productId
    getProduct = (req, res) => {
        res.json(req.product);
    }
}

