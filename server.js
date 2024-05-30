import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import errorHandlerMiddleware from './middleware/errorHandler.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 7070;


app.use(express.json());
app.use(cors());
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});

app.use(errorHandlerMiddleware);