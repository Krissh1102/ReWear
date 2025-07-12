import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String },
  photoURL: { type: String },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema); 