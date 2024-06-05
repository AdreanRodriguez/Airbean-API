import { orderDb } from '../models/orderModel.js';
export default class OrderController {


    getOrderById = (req, res) => {
        res.json({
            success: true,
            message: 'Order found.',
            status: 200,
            order: req.order
        });
    }

    placeOrder = async (req, res, next) => {
        const { order, user } = req;

        if (user) {

            if (!order.userId || order.userId === '') {
                order.userId = user.userId;
            }

            if (order.userId !== user.userId) {
                return next(new Error('Wrong userId for order.'));
            }
        }
        if (order.userId !== '' && !user) return next(new Error('Wrong userId for order.'));
        if (order.orderIsPlaced) return next(new Error('Order already placed.'));

        order.orderPlacedAt = new Date();
        order.orderIsPlaced = true;

        let combinedEstimatedTimeInMinutes = 0;
        for (const item of order.products) {
            combinedEstimatedTimeInMinutes += item.product.estimatedTimeInMinutes * item.amount;
        }

        combinedEstimatedTimeInMinutes = combinedEstimatedTimeInMinutes
        order.estimatedTimeInMinutes = Math.min(10 + (combinedEstimatedTimeInMinutes), 30);

        await this.update(order);

        return res.status(200)
            .json({
                success: true,
                message: 'Order placed.',
                status: 200,
                order: req.order
            });
    }

    addProduct = async (req, res) => {
        const { order, product} = req;

        let { amount } = req.body;
        amount = !amount || amount <= 0 ? 1 : amount;
        const index = order.products.findIndex(item => item.product._id === product._id)

        order.totalAmount += product.price * amount;

        if (index === -1) {
            order.products.unshift({
                product: product,
                amount: amount
            });
        }
        else {
            order.products[index].amount += amount;
        }
        await this.update(order);

        return res.status(200)
            .json({
                success: true,
                message: 'Product successfully added to order. Dont forget to add "orderId" inside body if this is a guest.',
                status: 200,
                order: order,
                addedProduct: product
            });

    };

    removeProduct = async (req, res) => {
        const { order, product, user } = req;
        if (user) {
            if (order.userId === '') {
                order.userId = user.userId
            }
            if (order.userId !== user.userId) return next(new Error('Wrong userId for order.'));
        }



        let { amount } = req.body;
        amount = !amount || amount <= 0 ? 1 : amount;

        const index = order.products.findIndex(item => item.product._id === product._id)
        order.totalAmount -= product.price * amount;

        if (order.products[index].amount <= amount) {
            order.products.splice(index, 1);
        }
        else {
            order.products[index].amount -= amount;
        }
        await this.update(order);
        return res.status(200)
            .json({
                success: true,
                message: 'product successfully removed from order.',
                status: 200,
                order: order,
                removedProduct: product
            });

    };

    getEstimatedTimeLeft = async (req, res) => {
        const { order } = req;
        const now = new Date();
        const orderPlacedAt = new Date(order.orderPlacedAt);
        const elapsedTime = (now - orderPlacedAt);
        let remainingTime = (order.estimatedTimeInMinutes*60000) - elapsedTime; // Återstående tid i millisekunder

        // Om återstående tid är negativ, sätt den till noll
        if (remainingTime < 0) {
            remainingTime = 0;
            return res.json({
                success: true,
                message: 'Kaffet ska ha levererats nu, enligt vårt supersäkra system!',
                status: 200,
            });
        }

        // Omvandla återstående tid till minuter och sekunder
        const minutes = Math.floor(remainingTime / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    
        res.json({ 
            success: true,
            message: `Uppskattad återstående tid: ${minutes} minuter och ${seconds} sekunder`,
            time: {
                minutes: minutes,
                seconds: seconds
            },
            status: 200,
        });
    };

    getHistoryByUserId = async (req, res) => {
        res.json({
            success: true,
            message: 'Orders found.',
            status: 200,
            orders: req.orders
        })
    };

    getAllHistory = async (req, res) => {
        res.json({
            success: true,
            message: 'Orders found.',
            status: 200,
            orders: req.orders
        })
    };
    

    async update(order) {
        try {
            const orderExists = await orderDb.findOne({ orderId: order.orderId });
            if (orderExists && orderExists !== null) {
                await orderDb.update(
                    { _id: orderExists._id },
                    {
                        $set: {
                            userId: order.userId,
                            products: order.products,
                            totalAmount: order.totalAmount,
                            orderPlacedAt: order.orderPlacedAt,
                            estimatedTimeInMinutes: order.estimatedTimeInMinutes,
                            orderIsPlaced: order.orderIsPlaced

                        }
                    }
                );
            } else {
                await orderDb.insert(order);
            }
        } catch (error) {
            console.error('Error updating order:', error);
        }
    }
}

