import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    googleId: { type: String },
    avatar: { type: String, default: '' },
    college: { type: String, default: '' },
    branch: { type: String, default: '' },
    year: { type: String, default: '' },
    bio: { type: String, default: '' },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    interests: [{ type: String }],
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)
