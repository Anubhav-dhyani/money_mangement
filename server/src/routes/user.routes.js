import express from 'express';
import multer from 'multer';
import { parse } from 'csv-parse/sync';
import User from '../models/User.js';
import Event from '../models/Event.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
router.use(protect);

const clean = (v) => String(v ?? '').trim();
const normalize = (row) => ({
  name: clean(row.Name ?? row.name),
  uniqueId: clean(row['Unique ID'] ?? row.uniqueId).toUpperCase(),
  mobile: clean(row.Mobile ?? row.mobile),
  email: clean(row.Email ?? row.email).toLowerCase(),
  accountNumber: clean(row['Account Number'] ?? row.accountNumber),
  ifscCode: clean(row['IFSC Code'] ?? row.ifscCode).toUpperCase(),
  bankName: clean(row['Bank Name'] ?? row.bankName)
});
const validate = (user) => {
  const requiredFields = ['name', 'uniqueId', 'mobile', 'email', 'accountNumber', 'bankName'];
  const missing = requiredFields.filter((key) => !user[key]);
  if (missing.length) return `Missing: ${missing.join(', ')}`;
  if (!/^\S+@\S+\.\S+$/.test(user.email)) return 'Invalid email address';
  if (user.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(user.ifscCode)) return 'Invalid IFSC code';
  return null;
};

router.get('/', async (req, res) => {
  const { search = '', page = 1, limit = 50 } = req.query;
  const filter = search ? { $or: [
    { name: { $regex: search, $options: 'i' } },
    { uniqueId: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
    { mobile: { $regex: search, $options: 'i' } }
  ] } : {};
  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip((Number(page) - 1) * Number(limit)).limit(Number(limit)),
    User.countDocuments(filter)
  ]);
  res.json({ users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) || 1 });
});

router.post('/', async (req, res) => {
  const data = normalize(req.body);
  const error = validate(data);
  if (error) return res.status(400).json({ message: error });
  const user = await User.create(data);
  res.status(201).json({ user });
});

router.put('/:id', async (req, res) => {
  const data = normalize(req.body);
  const error = validate(data);
  if (error) return res.status(400).json({ message: error });
  const user = await User.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!user) return res.status(404).json({ message: 'User not found.' });
  res.json({ user });
});

router.delete('/:id', async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  await Event.updateMany({}, { $pull: { users: user._id } });
  res.json({ message: 'User deleted.' });
});

router.post('/import', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Please upload a CSV file.' });
  if (!req.file.originalname.toLowerCase().endsWith('.csv')) return res.status(400).json({ message: 'Only CSV files are supported.' });
  let rows;
  try {
    rows = parse(req.file.buffer, { columns: true, skip_empty_lines: true, trim: true, bom: true });
  } catch (error) {
    return res.status(400).json({ message: `Could not read CSV: ${error.message}` });
  }
  if (rows.length > 5000) return res.status(400).json({ message: 'A maximum of 5,000 rows can be imported at once.' });
  const valid = [];
  const errors = [];
  rows.forEach((row, index) => {
    const data = normalize(row);
    const error = validate(data);
    if (error) errors.push({ row: index + 2, error }); else valid.push({ row: index + 2, data });
  });
  let imported = 0;
  for (const item of valid) {
    try { await User.create(item.data); imported += 1; }
    catch (error) { errors.push({ row: item.row, error: error.code === 11000 ? 'Unique ID or email already exists' : error.message }); }
  }
  res.status(errors.length && !imported ? 400 : 200).json({ message: `Imported ${imported} of ${rows.length} users.`, imported, failed: errors.length, errors: errors.slice(0, 100) });
});

export default router;
