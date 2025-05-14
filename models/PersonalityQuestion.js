import mongoose from 'mongoose';
const { Schema } = mongoose;

const personalityQuestionSchema = new Schema({
  _id: {
    type: String, // UUIDv4
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  trait: {
    type: String, // Only for IPIP questions
    enum: ['Extraversion', 'Agreeableness', 'Conscientiousness', 'Neuroticism', 'Openness'],
    required: function () {
      return this.type === 'ipip';
    },
  },
  reverse_scored: {
    type: Boolean,
    required: function () {
      return this.type === 'ipip';
    },
  },
  type: {
    type: String,
    enum: ['ipip', 'custom'],
    required: true,
  },
  options: {
    type: [String], // Only for custom questions
    required: function () {
      return this.type === 'custom';
    },
  },
});

export default mongoose.models.PersonalityQuestion ||
  mongoose.model('PersonalityQuestion', personalityQuestionSchema);
