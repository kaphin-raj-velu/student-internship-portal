import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: [true, "Student name is required"],
    trim: true,
    minlength: [2, "Name must contain at least 2 characters"],
    maxlength: [80, "Name cannot exceed 80 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"]
  },
  rollNumber: {
    type: String,
    required: [true, "Roll number is required"],
    trim: true,
    uppercase: true,
    minlength: [3, "Roll number is too short"],
    maxlength: [30, "Roll number is too long"]
  },
  internshipId: {
    type: String,
    required: [true, "Please select an internship"],
    trim: true
  },
  internshipTitle: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

applicationSchema.index({ email: 1, internshipId: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
