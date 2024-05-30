import nedb from 'nedb-promises';


export default class Order {

    constructor(userId, products = [], orderId) {
        this.orderIsPlaced = false;
        this.userId = userId;
        this.products = products; // {_id: _id, title: title, price: 56kr, amount: 3}
        this.createdAt = new Date().toISOString();
        this.orderPlacedAt = '';
        this.orderId = orderId;
    }

    addProduct = (product) => {
        const index = this.products.findIndex(item => item._id === product._id)
        if (index === -1) {
            this.products[index].amount += 1;
            return true;
        }
        else {
            this.products.unshift({ _id: product._id, title: title, price: price, amount: 1 });
            return true;
        }
    }
    
    removeProduct = (product) => {
        const index = this.products.findIndex(item => item._id === product._id)
        if (index === -1) {
            return false;
        }
        else {
            if (this.products[index].amount === 1) {
                this.products.splice(index, 1);
            }
            else {
                this.products[index].amount -= 1;
            }
            return true;
        }
    }
    
    placeOrder = () => {
        this.orderPlacedAt = new Date().toISOString();
        this.orderIsPlaced = true;
        return true;

    }

    getTotalAmount = () => {
        let totalAmount = 0;
        this.products.forEach(product => {
            totalAmount += product.amount * product.price;
        });
        return totalAmount;
    }

}


export const orderDb = nedb.create('config/orders.db');


