import { productDb } from '../models/productModel.js';

const validateProduct = async (req, res, next) => {
    const { productId } = req.params;
    const newError = new Error();

    if (!productId) {
        newError.message = 'No ID found';
        newError.status = 404;
        return next(newError);
    }

    const product = await productDb.find({ _id: productId });

    if (!product) {
        newError.message = 'Product not found';
        newError.status = 404;
        return next(newError);
    }

    //req.product kan användas  
    req.product = product;
    next();
}

export default validateProduct;
/**
 * Kan behöva lägga till ValidateProducts
 */


