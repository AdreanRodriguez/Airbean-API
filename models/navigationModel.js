import nedb from 'nedb-promises';
import Joi from 'joi';

const navigationSchema = Joi.object({
    title : Joi.string().max(30).required(),
    url : Joi.string().required(),
    color: Joi.string().max(30),
    isAdmin: Joi.boolean().default(false),
    _id : Joi.string().max(30)
});

export default navigationSchema;

export const navigationDb = nedb.create({
    filename: 'config/navigation.db',
    autoload: true
});