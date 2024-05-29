import nedb from 'nedb-promises';

export const orderDb = nedb.create('config/orders.db');