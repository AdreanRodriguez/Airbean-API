import userSchema, {userDb} from '../models/userModel.js';


export const validateRegistration = async (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    const newError = new Error();
    if (error) {
        newError.message = error.details[0].message;
        newError.status = 400;
        return next(newError);
    }

    const { username, password, validatePassword } = req.body;
    if (password !== validatePassword) {
        newError.message = 'Passwords are not equal.';
        newError.status = 401;
        return next(newError);
    }

    if (await userDb.findOne({ username: username })) {
        newError.message = 'Username already exists.';
        newError.status = 401;
        return next(newError);
    }

    next();
}