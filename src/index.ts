

import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import path from 'path';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(express.json());

// Configure CORS middleware
const corsOptions = {
    origin: 'http://localhost:3000', // Your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you need to send cookies or auth headers
  };
  
  app.use(cors(corsOptions));

// Connect to MongoDB
const connectDB = async () => {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
        console.error('MongoDB URI not provided!');
        process.exit(1);
    }
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected!');
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};
connectDB();

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
// console.log('Static image path:', path.join(__dirname, 'uploads', 'product_images'));
app.use('/uploads', (req, res, next) => { // Changed '/uploads/product_images' to '/uploads'
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  }, express.static(path.join(__dirname, 'uploads')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', (req: Request, res: Response) => {
    console.log(res);
    res.send('Welcome to the Express Backend API');
});


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error stack:', err.stack);
    console.error('Error message:', err.message);
    if (res.status) {
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    } else {
        res.status(500).json({ message: 'Unexpected server error' });
    }
    next(err);
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
export { app, server, connectDB };