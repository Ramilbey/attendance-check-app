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

router.post("/check", async (req, res) => {
  const { name, studentID } = req.body;

  try {
    const student = await Student.findOne({ name, studentID });

    if (!student) {
      return res
        .status(404)
        .json({ message: "Student not found or credentials invalid" });
    }

    const attendance = await Attendance.find({ studentId: student._id }).sort({
      date: -1,
    });

    res.json({ attendance });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
