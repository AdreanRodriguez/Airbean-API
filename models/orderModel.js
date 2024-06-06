import nedb from 'nedb-promises';
import { userDb } from './userModel.js';

export const orderDb = nedb.create({
    filename: 'config/orders.db',
    autoload: true
});
export default class Order {

    constructor(userId = '') {
        this.userId = userId;

        this.orderId = '';
        this.estimatedTimeInMinutes = 0;
        this.orderPlacedAt = '';
        this.orderIsPlaced = false;
        this.products = []; // {product: {produkt-objektet}, amount: 3}
        this.totalPrice = 0;
        this.credentials = {
            firstName: '',
            lastName: '',
            email: '',
            address: ''
        }

    }
    async init(){

        this.orderId = await this.generateId();
        if (this.userId !== '') {
            const user = await userDb.findOne({ userId: this.userId });
            if (user) {
                this.credentials = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    address: user.address
                };
            }
        }
        return this;
    }
    async generateId(){
        let randomId = Math.random().toString(36).slice(2, 8).toUpperCase();

        const orders = await orderDb.find()

        if (orders.length > 0) {
            while (orders.some(order => order.orderId === randomId)) {
                randomId = Math.random().toString(36).slice(2, 8).toUpperCase();
            }
        }
        return randomId;

        
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