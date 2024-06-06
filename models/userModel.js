import nedb from 'nedb-promises';
import Joi from 'joi'


const userSchema = Joi.object({
    firstName: Joi.string().min(4).max(10).required().messages({
        'string.base': 'Förnamn måste vara en sträng',
        'string.min': 'Förnamn måste vara minst 4 tecken',
        'string.max': 'Förnamn får inte vara längre än 10 tecken',
        'any.required': 'Förnamn är obligatoriskt'
    }),
    lastName: Joi.string().min(4).max(10).required().messages({
        'string.base': 'Efternamn måste vara en sträng',
        'string.min': 'Efternamn måste vara minst 4 tecken',
        'string.max': 'Efternamn får inte vara längre än 10 tecken',
        'any.required': 'Efternamn är obligatoriskt'
    }),
    address: Joi.string().min(4).required().messages({
        'string.base': 'Adress måste vara en sträng',
        'string.min': 'Adress måste vara minst 4 tecken',
        'any.required': 'Adress är obligatoriskt'
    }),
    email: Joi.string().email().required().messages({
        'string.base': 'E-post måste vara en sträng',
        'string.email': 'E-post måste vara en giltig e-postadress',
        'any.required': 'E-post är obligatoriskt'
    }),
    username: Joi.string().min(4).max(15).alphanum().required().messages({
        'string.base': 'Användarnamn måste vara en sträng',
        'string.min': 'Användarnamn måste vara minst 4 tecken',
        'string.max': 'Användarnamn får inte vara längre än 15 tecken',
        'string.alphanum': 'Användarnamn får endast innehålla alfanumeriska tecken',
        'any.required': 'Användarnamn är obligatoriskt'
    }),
    password: Joi.string().min(4).max(30).pattern(/^[a-zåäöA-ZÅÄÖ0-9 ]+$/).required().messages({
        'string.base': 'Lösenord måste vara en sträng',
        'string.min': 'Lösenord måste vara minst 4 tecken',
        'string.max': 'Lösenord får inte vara längre än 30 tecken',
        'string.pattern.base': 'Lösenord får endast innehålla bokstäver och siffror',
        'any.required': 'Lösenord är obligatoriskt'
    }),
    validatePassword: Joi.any().valid(Joi.ref('password')).required().messages({
        'any.only': 'Lösenorden matchar inte',
        'any.required': 'Bekräftelse av lösenord är obligatorisk'
    })
});


const loginSchema = Joi.object({
    username: Joi.string().min(4).max(15).alphanum().required().messages({
        'string.base': 'Användarnamn måste vara en sträng',
        'string.min': 'Användarnamn måste vara minst 4 tecken',
        'string.max': 'Användarnamn får inte vara längre än 15 tecken',
        'string.alphanum': 'Användarnamn får endast innehålla alfanumeriska tecken',
        'any.required': 'Användarnamn är obligatoriskt'
    }),
    password: Joi.string().min(4).max(30).pattern(/^[a-zåäöA-ZÅÄÖ0-9 ]+$/).required().messages({
        'string.base': 'Lösenord måste vara en sträng',
        'string.min': 'Lösenord måste vara minst 4 tecken',
        'string.max': 'Lösenord får inte vara längre än 30 tecken',
        'string.pattern.base': 'Lösenord får endast innehålla bokstäver och siffror',
        'any.required': 'Lösenord är obligatoriskt'
    })
});

export { userSchema, loginSchema };
export const userDb = nedb.create({
    filename: 'config/users.db',
    autoload: true
});