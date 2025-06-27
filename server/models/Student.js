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
    trim: true
  },
  cgpa: {
    type: Number,
    default: 0.0
  },
  country: {
    type: String,
    default: "Malaysia"
  },
  
  // Make all other fields optional
  advisor: {
    type: String,
    default: "Not assigned"
  },
  yearOfStudy: {
    type: Number,
    default: 1
  },
  program: {
    type: String,
    default: "Undecided"
  },
  batch: {
    type: String,
    default: "2023"
  },
  contactNumber: {
    type: String,
    default: "+60120000000"
  },
  emergencyContact: {
    type: String,
    default: "Not provided"
  }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);