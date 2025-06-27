const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");

// 📌 Create a student (with full profile data)
router.post("/", async (req, res) => {
  try {
    // Include all profile fields from request body
    const student = new Student({
      name: req.body.name,
      studentID: req.body.studentID,
      email: req.body.email || `${req.body.studentID.toLowerCase()}@xmu.edu.my`,
      country: req.body.country || "Malaysia",
      yearOfStudy: req.body.yearOfStudy,
      program: req.body.program,
      batch: req.body.batch,
      contactNumber: req.body.contactNumber,
      emergencyContact: req.body.emergencyContact
    });
    
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Get all students (with basic info)
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().select('name studentID email program batch');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Get student profile (full details)
router.get("/:id/profile", async (req, res) => {
  try {
    const student = await Student.findOne({ studentID: req.params.id })
      .select('-__v -createdAt -updatedAt');
      
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Update student profile
router.patch("/:id/profile", async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { studentID: req.params.id },
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📌 Student check-in with attendance (existing route - unchanged)
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
      date: a.date,
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