// models/QuizSession.js
import mongoose from "mongoose";

const quizSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    demographic: {
      type: String,
      enum: ["middle_school", "high_school", "adult"],
      required: true,
    },
    status: {
      type: String,
      enum: ["in_progress", "completed", "abandoned"],
      default: "in_progress",
    },
    currentStageId: {
      type: Number,
      default: 1,
    },
    completedStages: {
      type: [Number],
      default: [],
    },
    questionCount: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    xp: {
      type: Number,
      default: 0,
    },
    maxQuestions: {
      type: Number,
      required: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for faster queries
quizSessionSchema.index({ userId: 1, status: 1 });
quizSessionSchema.index({ createdAt: -1 });

const QuizSession = mongoose.models.QuizSession || mongoose.model("QuizSession", quizSessionSchema);

export default QuizSession;
