
import nedb from 'nedb-promises';

export const orderDb = nedb.create({
    filename: 'config/orders.db',
    autoload: true
});
export default class Order {

    constructor(userId = '') {
        this.userId = userId;

        let randomId = Math.random().toString(36).slice(2, 8).toUpperCase();

        orderDb.find().then((orders) => {

            if (orders.length > 0) {
                while (orders.some(order => order.orderId === randomId)) {
                    randomId = Math.random().toString(36).slice(2, 8).toUpperCase();
                }
            }

        });
        this.orderId = randomId;
        this.estimatedTimeInMinutes = 0;
        this.orderPlacedAt = '';
        this.orderIsPlaced = false;
        this.products = []; // {product: {produkt-objektet}, amount: 3}
        this.totalAmount = 0;
    }

}


//Olika alternativ för datalagring
//
// const productsTestOne = [
//     {
//         _id: 'asdasd', //_id
//         price: 59,
//         title: 'kaffe', //titel på kaffet
//         desc: 'blablala',
//         amount: 1
//     }
// ]

// const productsTestTwo = [
//     {
//         product: {
//                     _id: 'asdasd', //_id
//                     price: 59,
//                     title: 'kaffe', //titel på kaffet
//                     desc: 'blablabla',
//                     id:1
//         },
//         amount: 1
//     },
//     {
//         product: {
//                     _id: 'asdasd', //_id
//                     price: 59,
//                     title: 'kaffe', //titel på kaffet
//                     desc: 'blablabla',
//                     id:1
//         },
//         amount: 1
//     }
// ]

// const productsTestThree = [
//     {
//         productId: _id, //Man söker på productId så får man produkten
//         amount: 1
//     },
//     {
//         productId: _id,
//         amount: 5
//     }
// ]