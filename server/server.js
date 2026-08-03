import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';

const app = express();

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // required so the browser sends/receives httpOnly cookies
  })
);
app.use(express.json());
app.use(cookieParser());

// Health check — useful for confirming deploy is alive, no auth needed
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
// Further routers (products, cart, orders, dashboard, suppliers, ai) plug in
// here in the same pattern as we build them out.

// 404 handler for unmatched routes — keeps error shape consistent even here
app.use((req, res) => {
  res.status(404).json({ error: true, message: 'Route not found.', code: 'NOT_FOUND' });
});

// Must be registered LAST — this is what catches every thrown/forwarded error
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
