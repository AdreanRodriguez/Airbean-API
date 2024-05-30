import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js'
import errorHandlerMiddleware from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 7070;


app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);


app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});


app.use(errorHandlerMiddleware);