import mongoose from 'mongoose';
const { Schema } = mongoose;

const responseItemSchema = new Schema({
  questionId: {
    type: String,
    required: true,
    ref: 'PersonalityQuestion',
  },
  answer: {
    type: Schema.Types.Mixed, // Could be Number (1–5 Likert) or String (custom option)
    required: true,
  },
});

const personalityResponseSchema = new Schema({
  userId: {
    type: String, // or ObjectId if you’re referencing users
    required: true,    unique: true,
    index: true,  },
  responses: {
    type: [responseItemSchema],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.PersonalityResponse ||
  mongoose.model('PersonalityResponse', personalityResponseSchema);
