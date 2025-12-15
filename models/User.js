import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your Name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an Email"],
      unique: [true, "Email should be unique"],
    },
    password: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,

    // --- PERSONAL DETAILS (New) ---
    age: {
      type: Number,
      default: null, // Used to calculate demographic
    },
    demographic: {
      type: String,
      enum: ["middle_school", "high_school", "adult", ""],
      default: "adult",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    
    //  New fields
    currentAbility: {
      type: Number,
      default: 0,
    },
    completedQuestionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    phone: {
      type: String,
      default: "", // default: no phone number
    },
    avatarUrl: {
      type: String,
      default: "", // default: no custom avatar
    },
    
    // Career Recommendations
    careerRecommendations: {
      topRecommendation: {
        career_title: String,
        match_score: Number,
        salary_range: String,
        job_outlook: String,
        description: String,
        skills_matched: [String],
        personality_alignment: {
          analytical: Number,
          creative: Number,
          social: Number,
          independent: Number,
          structured: Number,
          flexible: Number,
        },
        reasoning: String,
      },
      alternativeCareers: [
        {
          career_title: String,
          match_score: Number,
          salary_range: String,
          job_outlook: String,
          description: String,
          skills_matched: [String],
          personality_alignment: {
            analytical: Number,
            creative: Number,
            social: Number,
            independent: Number,
            structured: Number,
            flexible: Number,
          },
          reasoning: String,
        }
      ],
      userProfile: {
        dominant_traits: [String],
        skill_strengths: [String],
      },
      timestamp: String,
      lastUpdated: Date,
    },
  },
  { timestamps: true }
);

// const User =mongoose.models.users || mongoose.model("users", userSchema)
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
