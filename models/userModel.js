import nedb from 'nedb-promises';
import Joi from 'joi'

const userSchema = Joi.object({
    username : Joi.string().min(4).max(15).alphanum().required(),
    password : Joi.string().min(4).max(30).pattern(/^[a-zåäöA-ZÅÄÖ0-9 ]+$/).required(),
    validatePassword : Joi.ref('password'),
    email : Joi.string().email().required(),
    firstName : Joi.string().min(4).max(10).required(),
    lastName : Joi.string().min(4).max(10).required(),
    address : Joi.string().min(4).required(),
});

export default userSchema;
export const userDb = nedb.create({
    filename: 'config/users.db',
    autoload: true
});