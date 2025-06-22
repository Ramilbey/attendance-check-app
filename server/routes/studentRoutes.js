const express = require('express');
const router = express.Router();
const Student = require('../models/Temp');


// 📌 Create a student
router.post('/', async (req, res) => {
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
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
