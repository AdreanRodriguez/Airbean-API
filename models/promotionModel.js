import nedb from 'nedb-promises';

export const promotionDb = nedb.create('config/promotions.db');

