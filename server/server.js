import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import onboardingRoutes from './routes/onboardingRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
const app = express();


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
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/ai', aiRoutes);
// Further routers (products, cart, orders, dashboard, suppliers, ai) plug in
// here in the same pattern as we build them out.

// 404 handler for unmatched routes — keeps error shape consistent even here
app.use((req, res) => {
  res.status(404).json({ error: true, message: 'Route not found.', code: 'NOT_FOUND' });
});

// Must be registered LAST — this is what catches every thrown/forwarded error
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

