import nedb from 'nedb-promises';
import Joi from 'joi'

const productSchema = Joi.object({
    id : Joi.number().required(),
    title : Joi.string().max(30).required(),
    desc : Joi.string().max(30).required(),
    price : Joi.string().max(30).required(),
    _id : Joi.string().max(30)
});

export default productSchema;

export const productDb = nedb.create('config/products.db');