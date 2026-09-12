import express from 'express';
import User from '../models/User.js';
import Event from '../models/Event.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.get('/', protect, async (req, res) => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const [users, events, newUsers, upcoming, recentUsers, recentEvents] = await Promise.all([
    User.countDocuments(), Event.countDocuments(), User.countDocuments({ createdAt: { $gte: monthStart } }),
    Event.countDocuments({ date: { $gte: now }, status: { $ne: 'completed' } }),
    User.find().sort({ createdAt: -1 }).limit(5), Event.find().populate('users').sort({ createdAt: -1 }).limit(4)
  ]);
  res.json({ stats: { users, events, newUsers, upcoming }, recentUsers, recentEvents });
});
export default router;
