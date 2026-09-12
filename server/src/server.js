import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDatabase } from './config/db.js';
import Admin from './models/Admin.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import eventRoutes from './routes/event.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import { errorHandler, notFound } from './middleware/error.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5001;
async function start() {
  if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) throw new Error('MONGODB_URI and JWT_SECRET must be configured.');
  await connectDatabase();
  const email = (process.env.ADMIN_EMAIL || 'admin@eventflow.local').toLowerCase();
  if (!(await Admin.findOne({ email }))) {
    await Admin.create({ name: process.env.ADMIN_NAME || 'Portal Admin', email, password: process.env.ADMIN_PASSWORD || 'Admin@123' });
    console.log(`Initial admin created: ${email}`);
  }
  app.listen(port, () => console.log(`API running on http://localhost:${port}`));
}
start().catch((error) => { console.error(error); process.exit(1); });
