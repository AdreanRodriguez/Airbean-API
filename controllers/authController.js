import { userDb } from '../models/userModel.js';

export default class AuthController {
    SECRET_KEY = process.env.SECRET_KEY || "a59be5d7-0753-4d62-b665-e62d62a63c5b";

    //URL = api/auth/register
    registerUser = async (req, res) => {
        const { username, password } = req.body;

        const users = await db.find();

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
            userId: randomId,
            role: 'customer'
        }

        userDb.insert(newUser);

        res.status(201).json({
            success: true,
            message: 'Successfully added user',
            status: 201
        });
    };
    //URL = api/auth/login
    loginUser = async (req, res) => {
        //DETTA GÖRS NU I MIDDÖLEWARE
        // const { username, password } = req.body;

        // const user = await db.findOne({ username: username, password: password });
        // if (!user) return res.status(401).json({
        //     success: false,
        //     message: 'Wrong username or password',
        //     status: 401,
        // });

        // const token = jwt.sign(user, this.SECRET_KEY);
        return res.status(202).json({
            success: true,
            message: 'Logged in successfully!',
            status: 202,
            token: req.token
        })
    }
    //URL = api/auth/users/:userId
    getUser = async (req, res) => {

        const userId = req.params.userId;
        const user = await userDb.findOne({ userId: userId });

        if (!user) return res.status(404).json({
            success: false,
            message: 'User not found',
            status: 404,
        });

        // processedData ser till så att vi inte skickar med lösenordet
        let processedData = JSON.stringify(user, (key, value) => { return key !== 'password' ? value : undefined });
        processedData = JSON.parse(processedData);

        return res.status(201).json({
            success: true,
            message: 'User found',
            status: 201,
            user: processedData
        });
    }
}
