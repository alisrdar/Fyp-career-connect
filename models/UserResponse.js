// models/UserResponse.js
import mongoose from 'mongoose'

const userResponseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  response: { type: String, required: true }, // user’s selected answer
  isCorrect: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true })

export default mongoose.models.UserResponse || mongoose.model("UserResponse", userResponseSchema)
