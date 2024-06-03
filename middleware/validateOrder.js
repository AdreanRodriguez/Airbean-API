import Order, { orderDb as db } from '../models/orderModel.js';

//Validera att ordern existerar
export const validateOrderStrict = async (req, res, next) => {
    const { orderId } = req.body;
    const newError = new Error();

    if (!orderId) {
        newError.message = 'orderId parameter is not found';
        newError.status = 404;
        return next(newError);
    }

    const order = await db.findOne({ orderId: orderId });

    if (!order) {
        newError.message = 'Order is not found';
        newError.status = 404;
        return next(newError);
    }
    req.order = order;
    next();
}

export const validateOrder = async (req, res, next) => {
    const { orderId } = req.body;
    const newError = new Error();

    let orderToReturn = null;
    if (!orderId) {
        orderToReturn = new Order();
    } else {
        orderToReturn = await db.findOne({ orderId: orderId });
        if (!orderToReturn) {
            newError.message = 'Order is not found';
            newError.status = 404;
            return next(newError);
        }
    }


    req.order = orderToReturn;
    next();

}