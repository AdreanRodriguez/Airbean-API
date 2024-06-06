import jwt from 'jsonwebtoken';
import { productDb } from '../models/productModel.js';
import Order, { orderDb } from '../models/orderModel.js';
import { navigationDb } from '../models/navigationModel.js';
import { userDb, userSchema, loginSchema } from '../models/userModel.js';
import { aboutDb } from '../controllers/aboutController.js';

const SECRET_KEY = process.env.SECRET_KEY || "a59be5d7-0753-4d62-b665-e62d62a63c5b";

const error = new Error();

const validate = {
    //ORDRAR
    orders: {
        //Kollar orderId som passeras in i bodyn. Om inte den finns, skapa ny order     
        one: async (req, res, next) => {
            const { orderId } = req.body;
            const { user } = req;

            let orderToReturn = null;

            if (!orderId) {
                // Om ingen orderId, försök hitta en existerande icke-placerad order för användaren
                if (user) {
                    orderToReturn = await orderDb.findOne({ userId: user.userId, orderIsPlaced: false });
                    if (!orderToReturn) {
                        orderToReturn = new Order(user.userId);
                        await orderToReturn.init();
                    }
                } else {
                    orderToReturn = new Order();
                    await orderToReturn.init();
                }

            }
            else {
                orderToReturn = await orderDb.findOne({ orderId: orderId, orderIsPlaced: false });
                if(!orderToReturn){
                    error.message = 'Order not found';
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

            const order = await orderDb.findOne({ orderId: orderId });

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
            const orders = await orderDb.find();

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

        isOrderPlaced: async (req, res, next) => {
            if (req.order.orderIsPlaced) {
                error.message = 'Unauthorized access: Order already placed.';
                error.status = 400;
                return next(error);
            }
            next();

        },
        isOrderNotPlaced: async (req, res, next) => {
            if (!req.order.orderIsPlaced) {
                error.message = 'Unauthorized access: Order not placed yet.';
                error.status = 400;
                return next(error);
            }
            next();

        },
        userIdInsideOrder: (req, res, next) => {
            const { order, user } = req;
            if (user) {
                if (order.userId !== '') {
                    if (order.userId !== user.userId) {
                        error.message = 'Unauthorized access: User ID is not the same as the one inside order.';
                        error.status = 400;
                        return next(error);
                    }
                }
                else {
                    order.userId = user.userId
                }
            }
            next();
        }
    },

    products: {
        one: async (req, res, next) => {
            const { productId } = req.params;

            if (!productId) {
                error.message = 'No ID found.';
                error.status = 404;
                return next(error);
            }

            const product = await productDb.findOne({ _id: productId });

            if (!product) {
                error.message = 'Product not found.';
                error.status = 404;
                return next(error);
            }

            //req.product kan användas  
            req.product = product;
            next();
        },

        many: async (req, res, next) => {
            const products = await productDb.find().sort({ id: 1 });
            if (!products || products.length <= 0) {
                error.message = 'Products not found.';
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
                const error = new Error()
                error.message = 'Username already taken.';
                error.status = 401;
                return next(error);
            }

            next();
},
 
        
        login: async (req, res, next) => {
            const { joiError } = loginSchema.validate(req.body);
            const { username, password } = req.body;

            if (joiError) {
                error.message = error.details[0].message;
                error.status = 400;
                return next(error);
            }

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

            if (!req.user?.isAdmin) {
                error.message = 'Unauthorized access: User not Admin.';
                error.status = 400;
                return next(error);
            }
            next();
        },

        validUserIdParam: async (req, res, next) => {
            const { userId } = req.params;

            if (!userId) {
                error.message = 'Bad credentials: no userId in parameter.';
                error.status = 400;
                return next(error);
            }
            const searchedUser = await userDb.findOne({ userId: userId });

            if (!searchedUser) {
                error.message = `Bad credentials: no user with userId ${userId}.`;
                error.status = 400;
                return next(error);
            }
            //Ta bort lösenordet från användarens uppgifter
            delete searchedUser.password;
            req.searchedUser = searchedUser;
            next();
        },
    },

    navigation: async (req, res, next) => {
        let navigationItems = await navigationDb.find();

        if (navigationItems.length <= 0){
            const defaultData = [
                {
                    title: 'Meny',
                    url: '/menu',
                    isAdmin: false
                },
                {
                    title: 'Vårt kaffe',
                    url: '/about',
                    isAdmin: false
                },
                {
                    title: 'Min profil',
                    url: '/profile',
                    isAdmin: false
                },
                {
                    title: 'Orderstatus',
                    url: '/status',
                    isAdmin: false
                }
            ];
            await navigationDb.insert(defaultData);
            navigationItems = defaultData;
        }
        req.navigationItems = navigationItems;
        next();
    },
    about: async (req, res, next) => {
        const textInfo = await aboutDb.findOne({ _id: 'zCGcKgM2UNsUfG6T' });

        if(!textInfo){
            error.message = `Bad credentials: No info found for about page.`;
            error.status = 400;
            return next(error);
        }
        req.textInfo = textInfo;
        next();
    } 
}

export default validate;
