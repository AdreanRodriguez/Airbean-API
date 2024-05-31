import { orderDb as db } from '../models/orderModel.js';
export default class OrderController {

    getOrder = (req, res) => {
        res.json({
            success: true,
            message: 'Order found.',
            status: 200,
            order: req.order
        });
    }

    placeOrder = async (req, res) => {
        const { order, product } = req;

        const placedOrderTime = new Date();
        order.orderPlacedAt = placedOrderTime.toLocaleString();
        order.orderIsPlaced = true;

        let amountOfCups = 0;
        order.products.forEach(item => {
            amountOfCups += item.amount;
        })
        order.estimatedTime = placedOrderTime.setMinutes(placedOrderTime.getMinutes() + 5 + (amountOfCups * 2)).toLocaleString();
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
        const { order, product } = req;

        const index = order.products.findIndex(item => item.product._id === product._id)
        if (index === -1) {
            order.products.unshift({
                product: product,
                amount: 1
            });
        }
        else {
            order.products[index].amount += 1;
        }
        await this.update(order);

        return res.status(200)
            .json({
                success: true,
                message: 'product successfully added to order. Dont forget to add "orderId" inside body.',
                status: 200,
                order: order,
                addedProduct: product
            });

    };

    removeProduct = async (req, res) => {
        const { order, product } = req;

        const index = order.products.findIndex(item => item._id === product._id)
        if (index === -1) {
            return false;
        }

        if (order.products[index].amount === 1) {
            order.products.splice(index, 1);
        }
        else {
            order.products[index].amount -= 1;
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

    async update(order) {
        try {
            const orderExists = await db.find({ orderId: order.orderId });
            console.log(`HÄR ÄR ORDEREXIS`, orderExists);
            if (orderExists && orderExists !== null) {
                console.log('INNE I UPPDATERING');
                await db.update(
                    { _id: orderExists._id },
                    {
                        $set: {
                            userId: order.userId,
                            orderId: order.orderId,
                            estimatedTime: order.estimatedTime,
                            orderPlacedAt: order.orderPlacedAt,
                            orderIsPlaced: order.orderIsPlaced,
                            products: order.products,
                            totalAmount: order.totalAmount
                        }
                    }
                );
            } else {
                console.log('UTANFÖR UPPDATERING');

                // Generera ett unikt order-ID här istället
                let randomId = Math.random().toString(36).slice(2, 8).toUpperCase();
                const orders = await db.find();

                if (orders.length > 0) {
                    while (orders.some(ord => ord.orderId === randomId)) {
                        randomId = Math.random().toString(36).slice(2, 8).toUpperCase();
                    }
                }

                order.orderId = randomId;
                await db.insert(order);
            }
        } catch (error) {
            console.error('Error updating order:', error);
        }

        // async update(order) {
        //     const orderExists = await db.find({ orderId: order.orderId });
        //     console.log(order);
        //     console.log(orderExists);
        //     if (orderExists.length > 0) {
        //         await db.update(
        //             { orderId: order.orderId },
        //             {
        //                 $set: {
        //                     userId: order.userId,
        //                     orderId: order.orderId,
        //                     estimatedTime: order.estimatedTime,
        //                     orderPlacedAt: order.orderPlacedAt,
        //                     orderIsPlaced: order.orderIsPlaced,
        //                     products: order.products, // {product: {produkt-objektet}, amount: 3}
        //                     totalAmount: order.totalAmount
        //                 }
        //             });
        //     }
        //     else {
        //         await db.insert(order);
        //     }
        // }
    }



}




// getTotalAmount() {
//     let totalAmount = 0;
//     this.products.forEach(product => {
//         totalAmount += product.amount * product.price;
//     });
//     return totalAmount;
// }

