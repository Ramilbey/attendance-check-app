const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  studentID: String,
  attendance: [
    {
      date: Date,
      status: {
        type: String,
        enum: ['Present', 'Absent'],
        default: 'Absent',
      },
    },
  ],
});

module.exports = mongoose.model('Student', studentSchema);
