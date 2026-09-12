import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  date: { type: Date, required: true },
  status: { type: String, enum: ['draft', 'scheduled', 'completed'], default: 'scheduled' },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
