import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  category: { type: String, required: true },
  condition: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  size: { type: String, required: true },
  status: { type: String, default: 'available' },
  createdAt: { type: Date, default: Date.now },
  userId: { type: String, required: true },
  userName: { type: String },
  userEmail: { type: String },
  swappedBy: { type: String, default: null },
  swappedAt: { type: Date, default: null },
});

export default mongoose.models.Item || mongoose.model('Item', ItemSchema); 