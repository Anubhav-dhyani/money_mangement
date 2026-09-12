import express from 'express';
import ExcelJS from 'exceljs';
import Event from '../models/Event.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  const events = await Event.find().populate('users').sort({ createdAt: -1 });
  res.json({ events });
});

router.get('/:id', async (req, res) => {
  const event = await Event.findById(req.params.id).populate('users');
  if (!event) return res.status(404).json({ message: 'Event not found.' });
  res.json({ event });
});

router.post('/', async (req, res) => {
  const { name, description, date, status, users = [] } = req.body;
  if (!name || !date) return res.status(400).json({ message: 'Event name and date are required.' });
  const validCount = await User.countDocuments({ _id: { $in: users } });
  if (validCount !== users.length) return res.status(400).json({ message: 'One or more selected users no longer exist.' });
  const event = await Event.create({ name, description, date, status, users: [...new Set(users)], createdBy: req.admin._id });
  await event.populate('users');
  res.status(201).json({ event });
});

router.put('/:id', async (req, res) => {
  const { name, description, date, status, users = [] } = req.body;
  const event = await Event.findByIdAndUpdate(req.params.id, { name, description, date, status, users: [...new Set(users)] }, { new: true, runValidators: true }).populate('users');
  if (!event) return res.status(404).json({ message: 'Event not found.' });
  res.json({ event });
});

router.delete('/:id', async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found.' });
  res.json({ message: 'Event deleted.' });
});

router.get('/:id/export', async (req, res) => {
  const event = await Event.findById(req.params.id).populate('users');
  if (!event) return res.status(404).json({ message: 'Event not found.' });
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'EventFlow';
  const sheet = workbook.addWorksheet('Participants', { views: [{ state: 'frozen', ySplit: 1 }] });
  sheet.columns = [
    { header: 'S.No.', key: 'serial', width: 9 }, { header: 'Name', key: 'name', width: 26 },
    { header: 'Unique ID', key: 'uniqueId', width: 18 }, { header: 'Mobile', key: 'mobile', width: 18 },
    { header: 'Email', key: 'email', width: 32 }, { header: 'Account Number', key: 'accountNumber', width: 24 },
    { header: 'IFSC Code', key: 'ifscCode', width: 18 }, { header: 'Bank Name', key: 'bankName', width: 26 }
  ];
  event.users.forEach((user, index) => sheet.addRow({ serial: index + 1, name: user.name, uniqueId: user.uniqueId, mobile: user.mobile, email: user.email, accountNumber: user.accountNumber, ifscCode: user.ifscCode, bankName: user.bankName }));
  sheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D201B' } };
    cell.alignment = { vertical: 'middle' };
  });
  sheet.getRow(1).height = 24;
  sheet.autoFilter = { from: 'A1', to: 'H1' };
  const buffer = await workbook.xlsx.writeBuffer();
  const safeName = event.name.replace(/[^a-z0-9-_]/gi, '-').toLowerCase();
  res.setHeader('Content-Disposition', `attachment; filename="${safeName}-participants.xlsx"`);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buffer);
});

export default router;
