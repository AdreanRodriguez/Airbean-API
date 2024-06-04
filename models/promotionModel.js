import nedb from 'nedb-promises';

export const promotionDb = nedb.create({
    filename: 'config/promotions.db',
    autoload: true
});

