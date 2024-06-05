import nedb from 'nedb-promises';
import Joi from 'joi';

const productSchema = Joi.object({
    _id: Joi.string().max(30),
    id: Joi.number().required(),
    desc: Joi.string().max(30).required(),
    title: Joi.string().max(30).required(),
    price: Joi.number().positive().required(),
    estimatedTimeInMinutes: Joi.number().positive().required(),
});

export default productSchema;

export const productDb = nedb.create({
    filename: 'config/products.db',
    autoload: true
});