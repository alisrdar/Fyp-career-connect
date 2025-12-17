// models/QuizQuestion.js
// Schema version 2.1 - Supporting gamified interactions
import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema(
  {
    // Unique identifier
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
      unique: true,
    },
    
    // Question prompt (max 280 characters)
    text: {
      type: String,
      required: true,
      maxlength: 280,
    },
    
    // Question type
    type: {
      type: String,
      enum: [
        "image_choice",
        "pair_match",
        "visual_swipe",
        "budget_slider",
        "sequence_order",
        "scenario_mcq"
      ],
      required: true,
    },
    
    // Media attachment
    media: {
      url: {
        type: String,
        default: "",
      },
      type: {
        type: String,
        enum: ["image", "svg", "audio", "video", ""],
        default: "",
      },
      alt_text: {
        type: String,
        default: "",
      },
    },
    
    // Options array (structure varies by question type)
    options: [{
      id: String,
      text: String,
      image_url: String,
      correct: Boolean,
      // For pair_match: side (left/right), pair_id
      side: String,
      pair_id: String,
    }],
    
    // Interaction configuration
    interaction_config: {
      time_limit_seconds: {
        type: Number,
        default: null,
      },
      slider_min: {
        type: Number,
        default: 0,
      },
      slider_max: {
        type: Number,
        default: 100,
      },
      target_sum: {
        type: Number,
        default: null,
      },
      correct_order: [{
        type: String,
      }],
      matches: {
        type: Map,
        of: String,
        default: {},
      },
      shuffle: {
        type: Boolean,
        default: true,
      },
    },
    
    // Tags for categorization
    tags: {
      primary: {
        type: String,
        default: "",
      },
      secondary: [{
        type: String,
      }],
      demographic_mask: [{
        type: String,
        enum: ["middle_school", "high_school", "adult"],
      }],
    },
    
    // Weights for trait/skill scoring
    weights: {
      scale: {
        type: String,
        default: "0-1",
      },
      mapping: {
        type: Map,
        of: Number,
        default: {},
        // Example: { "logic": 0.8, "creativity": 0.6 }
      },
    },
    
    // Difficulty rating (0.0-1.0)
    difficulty: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 0.5,
    },
    
    // Time limit in seconds
    time_limit_seconds: {
      type: Number,
      default: null,
    },
    
    // Explanation shown after attempt
    explanation: {
      type: String,
      default: "",
    },
    
    // Meta configuration
    meta: {
      shuffle_options: {
        type: Boolean,
        default: true,
      },
      max_attempts: {
        type: Number,
        default: 1,
      },
      client_renderable: {
        type: Boolean,
        default: true,
      },
    },
    
    // Legacy fields for backward compatibility
    category: {
      type: String,
      enum: ["aptitude", "personality", "career_interest", ""],
      default: "",
    },
    demographic: {
      type: String,
      enum: ["middle_school", "high_school", "adult", "all"],
      default: "all",
    },
    skillVector: {
      type: Map,
      of: Number,
      default: {},
    },
    
    // Admin Info
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    avgCorrectRate: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Indexes
quizQuestionSchema.index({ 'tags.primary': 1, 'tags.demographic_mask': 1, isActive: 1 });
quizQuestionSchema.index({ category: 1, demographic: 1, isActive: 1 }); // Legacy
quizQuestionSchema.index({ createdBy: 1 });
quizQuestionSchema.index({ createdAt: -1 });
quizQuestionSchema.index({ type: 1 });
quizQuestionSchema.index({ difficulty: 1 });

const QuizQuestion = mongoose.models.QuizQuestion || mongoose.model("QuizQuestion", quizQuestionSchema);

export default QuizQuestion;
