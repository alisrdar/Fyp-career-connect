// models/UserAIProfile.js
import mongoose from "mongoose";

const userAIProfileSchema = new mongoose.Schema(
  {
    // 🔗 The Link: This connects back to the main User model
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Ensures 1:1 relationship
    },

    // --- AI FIELDS ---
    
    // 1. Demographic (Calculated from Age or selected)
    demographic: {
      type: String,
      enum: ["middle_school", "high_school", "adult"],
      default: "adult",
    },

    // 2. Aptitude Scores (The User Vector)
    // Stores: { "logic": { mu: 0.6, sigma: 0.8 }, "math": ... }
    aptitudeScores: {
      type: Map,
      of: new mongoose.Schema({
        mu: Number,
        sigma: Number
      }, { _id: false }),
      default: {}
    },

    // 3. Question History
    // IDs of questions answered to prevent repetition
    questionHistory: {
      type: [String],
      default: []
    },

    // 4. Personality Scores (For Re-Ranking)
    // Stores: { "Openness": 2.75, "Extraversion": 3.5 ... }
    personalityScores: {
      type: Map,
      of: Number,
      default: {}
    },
  },
  { timestamps: true }
);

const UserAIProfile = mongoose.models.UserAIProfile || mongoose.model("UserAIProfile", userAIProfileSchema);

export default UserAIProfile;