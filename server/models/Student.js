const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  studentID: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@xmu\.edu\.my$/, 'Please fill a valid XMUM email address']
  },
  country: {
    type: String,
    required: true,
    default: "Malaysia"
  },
  yearOfStudy: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  program: {
    type: String,
    required: true,
    enum: ['Computer Science', 'Electrical Engineering', 'Business Administration', 'Other']
  },
  batch: {
    type: String,
    required: true,
    match: [/^20\d{2}$/, 'Batch must be a valid year (e.g., 2021)']
  },
  cgpa: {
    type: Number,
    min: 0,
    max: 4,
    default: 0
  },
  currentGPA: {
    type: Number,
    min: 0,
    max: 4,
    default: 0
  },
  advisor: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true,
    match: [/^\+?\d{1,3}[- ]?\d{1,14}$/, 'Please fill a valid phone number']
  },
  emergencyContact: {
    type: String,
    required: true
  },
  // You can keep these attendance fields if needed elsewhere in your system
  attendance: {
    present: { type: Number, default: 0 },
    absent: { type: Number, default: 0 },
    totalClasses: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
});

// Add index for faster queries
studentSchema.index({ studentID: 1, email: 1 });

// Virtual for email generation (if you want to auto-generate based on ID)
studentSchema.virtual('generatedEmail').get(function() {
  return `${this.studentID.toLowerCase()}@xmu.edu.my`;
});

module.exports = mongoose.model("Student", studentSchema);