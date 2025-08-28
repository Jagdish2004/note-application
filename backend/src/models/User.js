import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    passwordHash: { type: String },
    googleId: { type: String, index: true },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
