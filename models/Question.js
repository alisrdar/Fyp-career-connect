// models/Question.js
import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
  externalId: String, // original ID from dataset
  subject: String,
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
  article: String,
  support: String,
  difficulty: { type: String, enum: ["easy", "medium", "hard"] },
  source: String,

  // IRT parameters
  discrimination: { type: Number, default: 1.0 },  // "a"
  difficultyIndex: { type: Number, default: 0.0 }, // "b"
}, { timestamps: true })

export default mongoose.models.Question || mongoose.model("Question", questionSchema)
