import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: String,
  name: String,
  profilePhoto: String,
  accessToken: String,
  refreshToken: String,
  tokenExpiry: Date
});

export default mongoose.model('User', userSchema);
