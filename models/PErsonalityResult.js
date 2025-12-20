import mongoose from 'mongoose';
const { Schema } = mongoose;

const personalityResultSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  traitScores: {
    Openness: { type: Number, required: true },
    Conscientiousness: { type: Number, required: true },
    Extraversion: { type: Number, required: true },
    Agreeableness: { type: Number, required: true },
    Neuroticism: { type: Number, required: true },
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.PersonalityResult || mongoose.model('PersonalityResult', personalityResultSchema);
