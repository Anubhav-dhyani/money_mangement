import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export async function protect(req, res, next) {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null;
    if (!token) return res.status(401).json({ message: 'Authentication required.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-password');
    if (!req.admin) return res.status(401).json({ message: 'Admin account not found.' });
    next();
  } catch {
    res.status(401).json({ message: 'Your session is invalid or has expired.' });
  }
}
