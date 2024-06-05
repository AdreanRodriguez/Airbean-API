import { userDb } from '../models/userModel.js';

export default class AuthController {
    SECRET_KEY = process.env.SECRET_KEY || "a59be5d7-0753-4d62-b665-e62d62a63c5b";

    //URL = api/auth/register
    registerUser = async (req, res) => {
        const { username, password, email, firstName, lastName, address } = req.body;

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
            userId: randomId,
            email: email,
            firstName: firstName,
            lastName: lastName,
            address: address,
            isAdmin: false 
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

        //Ta bord lösenordet från användarens uppgifter
        delete user.password;

        return res.status(201).json({
            success: true,
            message: 'User found',
            status: 201,
            user: user
        });
    };

    getAllUsers = async (req,res) => {
        const users = await userDb.find();

        users.map(user => delete user.password);

        return res.status(200).json({
            success: true,
            message: 'Active users found.',
            status: 201,
            users: users
        })
    };
}
