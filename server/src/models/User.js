import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  uniqueId: { type: String, required: true, unique: true, trim: true, uppercase: true },
  mobile: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  accountNumber: { type: String, required: true, trim: true },
  ifscCode: { type: String, required: true, trim: true, uppercase: true },
  bankName: { type: String, required: true, trim: true }
}, { timestamps: true });

userSchema.index({ name: 'text', email: 'text', uniqueId: 'text' });

export default mongoose.model('User', userSchema);
