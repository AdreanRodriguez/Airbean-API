import { Router } from "express";
import { userDb } from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import userSchema from "../models/userModel.js";
import authenticationMiddleware from '../middleware/authentication.js';
const router = Router();


router.post('/register', async (req, res) => {

    const { username, password, validatePassword } = req.body;
    const { error } = userSchema.validate(req.body);
    if (error) {
        next(error);
    }
    if (await userDb.findOne({ username: username })) return res.status(400).json({ success: false, message: 'Användarnamnet är upptaget' });
    if (password !== validatePassword) return res.status(400).json({ success: false, message: 'Lösenorden stämmer inte överens.' });


    const users = await userDb.find();

    let randomId = Math.random().toString(36).slice(2, 7).toUpperCase();

    if (users.length < 1) {
        console.log(randomId);
    }
    else {
        while (users.some(user => user.userId === randomId)) {
            randomId = Math.random().toString(36).slice(2, 7).toUpperCase();
        }
    }
    const newUser = {
        username: username,
        password: password,
        userId: randomId
    }

    userDb.insert(newUser);

    const response = {
        success: true,
        message: 'Successfully added user',
        status: 201
    }

    res.status(201).json(response);
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await userDb.findOne({ username: username, password: password });
    if (!user) return res.status(401).json({
        success: false,
        message: 'Wrong username or password',
        status: 401,
    });

    const token = jwt.sign(user, process.env.SECRET_KEY);

    return res.status(202).json({
        success: true,
        message: 'Logged in successfully!',
        status: 202,
        token: `${token}`
    })
});

router.get('/:userId', async (req, res) => {

    const userId = req.params.userId;
    const user = await userDb.findOne({ userId: userId });

    if (!user) return res.status(404).json({
        success: false,
        message: 'User not found',
        status: 404,
    });

    // processedData ser till så att vi inte skickar med lösenordet
    let processedData = JSON.stringify(user, (key, value) => { return key !== 'password' ? value : undefined })
    processedData = JSON.parse(processedData);

    return res.status(201).json({
        success: true,
        message: 'User found',
        status: 201,
        user: processedData
    });
});

export default router;