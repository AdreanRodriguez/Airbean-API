import { productDb } from '../models/productModel.js';
import userSchema, {userDb} from '../models/userModel.js';
import Order, { orderDb} from '../models/orderModel.js';
const SECRET_KEY = process.env.SECRET_KEY || "a59be5d7-0753-4d62-b665-e62d62a63c5b";
import jwt from 'jsonwebtoken';
const newError = new Error();

const validate = {
    //ORDRAR
    orders: {
        
        one: async (req, res, next) => {
            const { orderId } = req.body;
        
            let orderToReturn = null;
            if (!orderId) {
                orderToReturn = new Order();
            } else {
                orderToReturn = await orderDb.findOne({ orderId: orderId });
                if (!orderToReturn) {
                    newError.message = 'Order is not found';
                    newError.status = 404;
                    return next(newError);
                }
            }
        
        
            req.order = orderToReturn;
            next();
        
        },

        oneStrict: async (req, res, next) => {
            let { orderId } = req.body;
            const {productId} = req.params;

            orderId = !orderId ? req.params.orderId : undefined;

            console.log(orderId);
            if (!orderId) {
                newError.message = 'orderId parameter is not found';
                newError.status = 404;
                return next(newError);
            }
        
            const order = await orderDb.findOne({ orderId: orderId });
        
            if (!order) {
                newError.message = 'Order is not found';
                newError.status = 404;
                return next(newError);
            }

            if(req.method === 'DELETE' && order.products.findIndex(item => item.product._id === productId) === -1){

                newError.message = `Product with ID ${productId} does not exist in order`;
                newError.status = 404;
                return next(newError);
            }

            req.order = order;
            next();
        },

        history: async(req, res, next) => {

        },
        placeOrder: async(req, res, next) => {

        },
        userIdInsideOrder: (req, res, next) => {
            const {order, user} = req;
            if(order.userId !== ''){
                if(order.userId !== user.userId){
                    newError.message = 'Unauthorized access.';
                    newError.status = 400;
                    return next(newError);
                }
            }
            next();
            
        }

    },

    products: {

        one: async (req, res, next) => {
            const { productId } = req.params;
        
            if (!productId) {
                newError.message = 'No ID found';
                newError.status = 404;
                return next(newError);
            }
        
            const product = await productDb.findOne({ _id: productId });
        
            if (!product) {
                newError.message = 'Product not found';
                newError.status = 404;
                return next(newError);
            }
        
            //req.product kan användas  
            req.product = product;
            next();
        },

        many: async (req, res, next) => {
            const products = await productDb.find();
            if(!products || products.length <= 0){
                newError.message = 'No products found';
                newError.status = 400;
                return next(newError);
            }
            req.products = products;
            next();

        }
    },

    users: {
        register : async (req, res, next) => {
            const { error } = userSchema.validate(req.body);
            
            if (error) {
                newError.message = error.details[0].message;
                newError.status = 400;
                return next(newError);
            }
        
            const { username, password, validatePassword } = req.body;
            if (password !== validatePassword) {
                newError.message = 'Passwords are not equal.';
                newError.status = 401;
                return next(newError);
            }
        
            if (await userDb.findOne({ username: username })) {
                newError.message = 'Username already exists.';
                newError.status = 401;
                return next(newError);
            }
        
            next();
        },

        login: async (req, res, next) => {
            const { username, password } = req.body;

        const user = await userDb.findOne({ username: username, password: password });

        if (!user) {
            newError.message = 'Bad credentials: Wrong username or password.';
            newError.status = 400;
            return next(newError);
        }


        const token = jwt.sign(user, SECRET_KEY);
        req.token = token;

        next();
        },
        getOne: async(req, res, next) => {
            //hämtar info om personen, om man har rättigheter till det.
        },
        getAll: async (req,res,next) => {
            //Kolla om man är admin eller inte.
        },
        

    }

}

export default validate;
