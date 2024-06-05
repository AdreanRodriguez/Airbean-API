import nedb from 'nedb-promises';
import Joi from 'joi';

const navigationSchema = Joi.object({
    _id : Joi.string().max(30),
    url : Joi.string().required(),
    isAdmin: Joi.boolean().default(false),
    title : Joi.string().max(30).required(),
});

export default navigationSchema;

export const navigationDb = nedb.create({
    filename: 'config/navigation.db',
    autoload: true
});