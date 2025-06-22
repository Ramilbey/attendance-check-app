const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  studentID: {
    type: String,
    required: true,
    unique: true,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model("Student", studentSchema);
