import nedb from 'nedb-promises';

export const productDb = nedb.create('config/products.db');