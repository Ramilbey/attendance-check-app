const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");

// 📌 Create a student
router.post("/", async (req, res) => {
  const { name, studentID } = req.body;
  try {
    const student = new Student({ name, studentID });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/check', async (req, res) => {
  const { name, studentID } = req.body;

  try {
    const student = await Student.findOne({ name, studentID });

    if (!student) {
      return res.status(404).json({ message: 'Student not found or credentials invalid' });
    }

    const attendance = await Attendance.find({ studentId: student._id }).sort({ date: -1 });

    const total = attendance.length;
    const present = attendance.filter((a) => a.status === 'Present').length;
    const absent = total - present;
    const percentage = total === 0 ? "0%" : `${Math.round((present / total) * 100)}%`;

    const formatEntry = (a) => ({
      lesson: a.lesson,
      date: a.date, // Keep full ISO date with time
    });

    const presentDetails = attendance
      .filter((a) => a.status === 'Present')
      .map(formatEntry);

    const absentDetails = attendance
      .filter((a) => a.status === 'Absent')
      .map(formatEntry);

    res.json({
      summary: {
        studentID: student.studentID,
        name: student.name,
        totalClasses: total,
        present,
        absent,
        attendancePercentage: percentage,
      },
      presentDetails,
      absentDetails,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

  

module.exports = router;
