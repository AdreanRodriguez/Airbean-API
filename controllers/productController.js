import { productDb as db } from '../models/productModel.js'

export default class ProductController {
    // URL =  api/products
    //ALLA PRODUKTER
    getAllProducts = async (req, res, next) => {
        try {
            const products = await db.find().sort({ id: 1 });

            if (!products) {
                const newError = new Error('No products found');
                newError.status = 404;
                return next(newError);
            }

            res.status(200).json({
                success: true,
                message: 'Products found.',
                status: 200,
                products: products
            });
        } catch (error) {
            const newError = new Error('An error occurred while retrieving products');
            newError.status = 500;
            newError.details = error.message;
            return next(newError);
        }
    }
    // ENSKILD PRODUKT PÅ ID
    // URL =  api/products/:productId
    getProduct = async (req, res) => {
        const productId = req.params.productId;

        try {
            const product = await db.findOne({ _id: productId });

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found.',
                    status: 404
                });
            }

            res.status(200).json({
                success: true,
                message: 'Product found.',
                status: 200,
                product: product
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'An error occurred while retrieving the product.',
                status: 500,
                error: error.message
            });
        }
    }
}

