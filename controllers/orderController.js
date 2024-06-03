import { orderDb } from '../models/orderModel.js';
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
        let {amount} = req.body;
        amount = !amount || amount <= 0 ? 1 : amount;
        console.log(amount);
        const index = order.products.findIndex(item => item.product._id === product._id)

        order.totalAmount += product.price;

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
                message: 'product successfully added to order. Dont forget to add "orderId" inside body.',
                status: 200,
                order: order,
                addedProduct: product
            });

    };

    removeProduct = async (req, res) => {
        const { order, product } = req;
        let { amount } = req.body;
        amount = !amount || amount <= 0 ? 1 : amount;

        const index = order.products.findIndex(item => item.product._id === product._id)

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

    async update(order) {
        try {
            const orderExists = await orderDb.findOne({ orderId: order.orderId }); // Ändra till findOne istället för find, annars krashar de.
            if (orderExists && orderExists !== null) {
                console.log(`HÄR ÄR ORDEREXIS`, orderExists);
                console.log('INNE I UPPDATERING');
                await orderDb.update(
                    { _id: orderExists._id },
                    {
                        $set: {
                            products: order.products,
                            totalAmount: order.totalAmount
                        }
                    }
                );
            } else {
                console.log('UTANFÖR UPPDATERING');

                // Generera ett unikt order-ID här istället
                //Jag la till detta igen i klassen för Order, då det gör detta kodstycket lite mindre och tydligare att läsa :) 
                // let randomId = Math.random().toString(36).slice(2, 8).toUpperCase();
                // const orders = await orderDb.find();

                // if (orders.length > 0) {
                //     while (orders.some(ord => ord.orderId === randomId)) {
                //         randomId = Math.random().toString(36).slice(2, 8).toUpperCase();
                //     }
                // }
                // order.orderId = randomId;
                await orderDb.insert(order);
                console.log(`LÄGGER IN ORDERN I DB`, order)
            }
        } catch (error) {
            console.error('Error updating order:', error);
        }

        // async update(order) {
        //     const orderExists = await orderDb.find({ orderId: order.orderId });
        //     console.log(order);
        //     console.log(orderExists);
        //     if (orderExists.length > 0) {
        //         await orderDb.update(
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
        //         await orderDb.insert(order);
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


