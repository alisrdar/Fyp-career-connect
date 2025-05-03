// models/User.js
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your Name"]
  },
  email: { 
    type: String, 
    required: [true,"Please provide an Email"], 
    unique: [true, "Email should be unique"] 
  },
  password: { 
    type: String, 
    required: true 
  },

  isVerified: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  forgotPasswordToken : String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
}, { timestamps: true })

const User =mongoose.models.users || mongoose.model("users", userSchema)
// const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User
