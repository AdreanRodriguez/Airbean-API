
export default class ProductController {
    // URL =  api/products
    //ALLA PRODUKTER
    getAllProducts = async (req, res, next) => {
        res.status(200).json({
            success: true,
            message: 'Products found.',
            status: 200,
            products: req.products
        });
    }
    
    // ENSKILD PRODUKT PÅ ID
    // URL =  api/products/:productId
    getProduct = async (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Product found.',
            status: 200,
            product: req.product
        });       
    }
}

