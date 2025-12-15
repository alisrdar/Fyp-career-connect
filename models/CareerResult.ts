import mongoose from "mongoose";

const careerResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  dateTaken: {
    type: Date,
    default: Date.now
  },
  // Store the Top 10 list exactly as the API returned it
  recommendations: [{
    title: String,
    code: String,
    match_score: Number,
    top_factors: [String], // ["Logic", "Math"]
    aptitude_score: Number,
    personality_fit: Number
  }]
});

const CareerResult = mongoose.models.CareerResult || mongoose.model("CareerResult", careerResultSchema);
export default CareerResult;