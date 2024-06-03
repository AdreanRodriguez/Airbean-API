import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import errorHandlerMiddleware from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 7070;


app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes); // LOGGA IN HÄR!
app.use('/api/about', aboutRoutes) // HÄMTA ABOUT TEXTEN
app.use('/api/orders', orderRoutes); // HÄMTA ALLA ORDRAR
app.use('/api/products', productRoutes); // HÄMTA ALLA PRODUKTER

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});


app.use(errorHandlerMiddleware);