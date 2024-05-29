import nedb from 'nedb-promises';
import Joi from 'joi'

const userSchema = Joi.object({
    username : Joi.string().min(4).max(10).alphanum().required(),
    password : Joi.string().min(4).max(30).pattern(/^[a-zåäöA-ZÅÄÖ0-9 ]+$/).required(),
    validatePassword : Joi.string().min(4).max(30).pattern(/^[a-zåäöA-ZÅÄÖ0-9 ]+$/).required(),
});

export default userSchema;
export const userDb = nedb.create('config/users.db');