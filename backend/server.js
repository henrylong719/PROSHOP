import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import path from 'path';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import uploadRoutes from './routes/uploadRoutes.js';

//  require and configure dotenv.
dotenv.config();

const app = express();

// for parsing body information in the incoming POST request
app.use(express.json());

// connect database
connectDB();

// middleware is a function that has access to the req res cycle in the route (app.use())
// next() (move to next piece of middleware)

app.get('/', (req, res) => {
  res.send('API is running....');
});

// anything goes to /api/products, linking to productRoutes
app.use('/api/products', productRoutes);

// anything goes to /api/users, linking to userRoutes
app.use('/api/users', userRoutes);

// anything goes to /api/order, linking to orderRoutes
app.use('/api/orders', orderRoutes);

// anything goes to /api/upload, linking to uploadRoutes
app.use('/api/upload', uploadRoutes);

// upload folder is not accessed by browser by default (need to make it static)

// __dirname points to current folder (however only available in the commonjs)
// in ES6 we need to use path.resolve() to mimic it
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// for getting PayPal client id (when we are ready for payment, we fetch the route and get the id)

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

// middleware to handle not found URL (./middleware/errorMiddleware.js)
app.use(notFound);

// middleware to handle error message (./middleware/errorMiddleware.js)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
