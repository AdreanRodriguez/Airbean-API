import nedb from 'nedb-promises';
import Joi from 'joi';

const productSchema = Joi.object({
    id : Joi.number().required(),
    title : Joi.string().max(30).required(),
    desc : Joi.string().max(30).required(),
    price : Joi.number().positive().required(),
    estimatedTimeInMinutes : Joi.number().positive().required(),
    _id : Joi.string().max(30)
});

export default productSchema;

export const productDb = nedb.create({
    filename: 'config/products.db',
    autoload: true
});