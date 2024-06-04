import jwt from 'jsonwebtoken';
import { productDb } from '../models/productModel.js';
import Order, { orderDb } from '../models/orderModel.js';
import { navigationDb } from '../models/navigationModel.js';
import userSchema, { userDb } from '../models/userModel.js';

const SECRET_KEY = process.env.SECRET_KEY || "a59be5d7-0753-4d62-b665-e62d62a63c5b";
const error = new Error();

const validate = {
    //ORDRAR
    orders: {
        //Kollar orderId som passeras in i bodyn. Om inte den finns, skapa ny order     
        one: async (req, res, next) => {
            const { orderId } = req.body;

            let orderToReturn = null;
            if (!orderId) {
                orderToReturn = new Order();
            } else {
                orderToReturn = await orderDb.findOne({ orderId: orderId, orderIsPlaced: false });
                if (!orderToReturn) {
                    error.message = 'Order is either not found or already placed';
                    error.status = 404;
                    return next(error);
                }
            }


            req.order = orderToReturn;
            next();

        },
        //Kollar orderId som passeras in i bodyn, annars kan du inte komma vidare   
        oneStrict: async (req, res, next) => {
            let { orderId } = req.body;
            const { productId } = req.params;


            if (!orderId) {
                if (req.params.orderId) {
                    orderId = req.params.orderId;
                }
                else {
                    error.message = 'orderId parameter is not found';
                    error.status = 404;
                    return next(error);
                }
            }

            const order = await orderDb.findOne({ orderId: orderId || orderIdViaParams });

            if (!order) {
                error.message = 'Order is not found';
                error.status = 404;
                return next(error);
            }

            if (req.method === 'DELETE' && order.products.findIndex(item => item.product._id === productId) === -1) {

                error.message = `Product with ID ${productId} does not exist in order`;
                error.status = 404;
                return next(error);
            }

            req.order = order;
            next();
        },

        many: async (req, res, next) => {
            const orders = orderDb.find();

            if (orders.length < 0) {
                error.message = 'No orders found'
                error.status = 404
                return next(error);
            }
            req.orders = orders;
            next();
        },

        history: async (req, res, next) => {
            const orders = await orderDb.find({ userId: req.user.userId }).sort({ orderPlacedAt: 1 });

            if (orders.length < 0) {
                error.message = 'No orders found'
                error.status = 404
                return next(error);
            }
            req.orders = orders;
            next();
        },

        placeOrder: async (req, res, next) => {

        },
        userIdInsideOrder: (req, res, next) => {
            const { order, user } = req;
            if (order.userId !== '') {
                if (order.userId !== user.userId) {
                    error.message = 'Unauthorized access.';
                    error.status = 400;
                    return next(error);
                }
            }
            next();

        }

    },

    products: {

        one: async (req, res, next) => {
            const { productId } = req.params;

            if (!productId) {
                error.message = 'No ID found';
                error.status = 404;
                return next(error);
            }

            const product = await productDb.findOne({ _id: productId });

            if (!product) {
                error.message = 'Product not found';
                error.status = 404;
                return next(error);
            }

            //req.product kan användas  
            req.product = product;
            next();
        },

        many: async (req, res, next) => {
            const products = await productDb.find();
            if (!products || products.length <= 0) {
                error.message = 'No products found';
                error.status = 400;
                return next(error);
            }
            req.products = products;
            next();

        }
    },

    users: {
        register: async (req, res, next) => {
            const { error } = userSchema.validate(req.body);

            if (error) {
                error.message = error.details[0].message;
                error.status = 400;
                return next(error);
            }

            const { username, password, validatePassword } = req.body;
            if (password !== validatePassword) {
                error.message = 'Passwords are not equal.';
                error.status = 401;
                return next(error);
            }

            if (await userDb.findOne({ username: username })) {
                error.message = 'Username already exists.';
                error.status = 401;
                return next(error);
            }

            next();
        },

        login: async (req, res, next) => {
            const { username, password } = req.body;

            const user = await userDb.findOne({ username: username, password: password });

            if (!user) {
                error.message = 'Bad credentials: Wrong username or password.';
                error.status = 400;
                return next(error);
            }


            const token = jwt.sign(user, SECRET_KEY);
            req.token = token;

            next();
        },

        isAdmin: async (req, res, next) => {
            if (!req.user.isAdmin) {
                error.message = 'Unauthorized access.';
                error.status = 400;
                return next(error);
            }
            next();
        },

        getOne: async (req, res, next) => {
            //hämtar info om personen, om man har rättigheter till det.
        },

        getAll: async (req, res, next) => {
            //Kolla om man är admin eller inte.
        },


    },

    navigation: async (req, res, next) => {
        const navigationItems = await navigationDb.find();
        
        req.navigationItems = navigationItems;
        next();
    }

}

export default validate;
