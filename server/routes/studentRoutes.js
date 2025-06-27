const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");

// Helper function for error handling
const handleError = (res, status, message) => {
  console.error(message);
  return res.status(status).json({ error: message });
};

// 📌 Create a student
router.post("/", async (req, res) => {
  try {
    const studentData = {
      name: req.body.name,
      studentID: req.body.studentID,
      email: req.body.email || `${req.body.studentID.toLowerCase()}@xmu.edu.my`,
      country: req.body.country || "Malaysia",
      yearOfStudy: req.body.yearOfStudy || 1,
      program: req.body.program || "Undecided",
      batch: req.body.batch || new Date().getFullYear().toString(),
      contactNumber: req.body.contactNumber || "+60120000000",
      emergencyContact: req.body.emergencyContact || "Not provided",
      advisor: req.body.advisor || "Not assigned"
    };

    const student = new Student(studentData);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    if (err.code === 11000) {
      return handleError(res, 400, "Student ID already exists");
    }
    handleError(res, 500, err.message);
  }
});

// 📌 Get all students (lightweight version)
router.get("/", async (req, res) => {
  try {
    const students = await Student.find()
      .select('name studentID email program batch yearOfStudy')
      .lean();
    res.json(students);
  } catch (err) {
    handleError(res, 500, "Failed to fetch students");
  }
});

// 📌 Get full student profile
router.get("/:studentID/profile", async (req, res) => {
  try {
    const student = await Student.findOne({ studentID: req.params.studentID })
      .select('studentID name email program batch yearOfStudy contactNumber emergencyContact advisor cgpa country')
      .lean();

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 📌 Update student profile
router.patch("/:studentID/profile", async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'yearOfStudy', 'program', 'batch', 
                            'contactNumber', 'emergencyContact', 'advisor', 'cgpa', 'country'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return handleError(res, 400, "Invalid updates");
    }

    const student = await Student.findOneAndUpdate(
      { studentID: req.params.studentID },
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!student) {
      return handleError(res, 404, "Student not found");
    }

    res.json(student);
  } catch (err) {
    handleError(res, 400, err.message);
  }
});

// 📌 Student attendance check
router.post("/check", async (req, res) => {
  try {
    const { name, studentID } = req.body;

    if (!name || !studentID) {
      return handleError(res, 400, "Name and Student ID are required");
    }

    const student = await Student.findOne({ name, studentID });
    if (!student) {
      return handleError(res, 404, "Student not found or credentials invalid");
    }

    const attendance = await Attendance.find({ studentId: student._id })
      .sort({ date: -1 })
      .lean();

    const present = attendance.filter(a => a.status === 'Present').length;
    const total = attendance.length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    res.json({
      summary: {
        studentID: student.studentID,
        name: student.name,
        totalClasses: total,
        present,
        absent: total - present,
        attendancePercentage: `${percentage}%`
      },
      presentDetails: attendance.filter(a => a.status === 'Present')
        .map(({ lesson, date }) => ({ lesson, date })),
      absentDetails: attendance.filter(a => a.status === 'Absent')
        .map(({ lesson, date }) => ({ lesson, date }))
    });
  } catch (err) {
    handleError(res, 500, "Server error during attendance check");
  }
});

module.exports = router;
