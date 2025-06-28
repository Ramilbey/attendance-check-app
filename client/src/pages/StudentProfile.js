import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./StudentProfile.css";

// Your exact timetable data
const timetableData = {
  "Monday": [
    { time: "8:00-9:00", course: "Data Structure", code: "S5O'108", lecturer: "Safi K2th Bh4d" },
    { time: "9:00-10:00", course: "(Week 1-15)", code: "A3A630" },
    { time: "12:00-1:00", course: "Computer Architecture", code: "A2-B707", lecturer: "Middle Bh4a Azazek" },
    { time: "2:00-3:00", course: "Interplay and Anti-Generation Lab", code: "MW03222", lecturer: "Young Keong" },
    { time: "3:00-4:00", course: "Fundamentals of Network Technology", code: "S5O'703", lecturer: "Thursday/July Bansasamy" },
    { time: "4:00-5:00", course: "(Week 1-15)", code: "A4A670" },
    { time: "4:00-5:00", course: "Data Structure", code: "S5O'108", lecturer: "Safi K2th Bh4d" },
    { time: "4:00-5:00", course: "(Week 1-15)", code: "A1S630" }
  ],
  "Tuesday": [
    // Add your Tuesday classes if any
  ],
  "Wednesday": [
    // Add your Wednesday classes if any
  ],
  "Thursday": [
    // Add your Thursday classes if any
  ],
  "Friday": [
    // Add your Friday classes if any
  ],
  "Saturday": [
    { time: "9:00-10:00", course: "Introduction of Software Engineering", code: "S5O'107", lecturer: "Al-Fanarch Middle Warsaw: Dilated" },
    { time: "10:00-11:00", course: "(Week 1-15)", code: "A1-SG01" },
    { time: "5:00-6:00", course: "Fundamentals of Network Technology", code: "S5O'703", lecturer: "Thursday/July Bansasamy" },
    { time: "5:00-6:00", course: "(Week 1-15)", code: "A1-A7D" }
  ],
  "Sunday": [
    // Add your Sunday classes if any
  ]
};

const academicCalendar = {
  semesters: [
    { name: "February Semester", start: "2025-02-07", end: "2025-03-21" },
    { name: "April Semester", start: "2025-03-28", end: "2025-08-01" },
    { name: "September Semester", start: "2025-09-26", end: "2026-01-23" }
  ],
  holidays: [
    { date: "2025-01-01", name: "New Year's Day" },
    { date: "2025-01-02", name: "Aguro's Birthday" },
    // Add all other holidays from your table
  ]
};

const StudentProfile = () => {
  const { studentID } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [todayTimetable, setTodayTimetable] = useState([]);
  const [currentDay, setCurrentDay] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/students/${studentID}/profile`
        );
        if (!response.ok) throw new Error("Failed to fetch student");
        const data = await response.json();
        setStudent(data);
        
        // Set timetable for current day
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        setCurrentDay(today);
        setTodayTimetable(timetableData[today] || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentID]);

  // ... (keep all your existing state components like LoadingState, ErrorState, etc.)

  const HeaderSection = ({ student, navigate }) => {
    const [showTimetableTooltip, setShowTimetableTooltip] = useState(false);

    return (
      <header className="profile-header">
        {/* ... other header elements ... */}
        
        <div className="badge-container">
          <motion.div 
            className="profile-badge"
            whileHover={{ scale: 1.05 }}
            onMouseEnter={() => setShowTimetableTooltip(true)}
            onMouseLeave={() => setShowTimetableTooltip(false)}
            onClick={() => navigate('/timetable')}
          >
            {student.program}
            
            <AnimatePresence>
              {showTimetableTooltip && (
                <motion.div
                  className="timetable-tooltip"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h4>{currentDay}'s Classes</h4>
                  {todayTimetable.length > 0 ? (
                    <ul>
                      {todayTimetable.map((classItem, index) => (
                        <li key={index}>
                          <strong>{classItem.time}</strong><br />
                          {classItem.course}<br />
                          {classItem.code} | {classItem.lecturer || 'TBA'}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No classes scheduled today</p>
                  )}
                  <p className="tooltip-hint">Click to view full timetable</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </header>
    );
  };

  // Add this new component for the full timetable page
  const TimetablePage = () => {
    const [selectedDay, setSelectedDay] = useState(currentDay);

    return (
      <div className="timetable-page">
        <h2>Software Engineering Timetable</h2>
        
        <div className="day-selector">
          {Object.keys(timetableData).map(day => (
            <button
              key={day}
              className={selectedDay === day ? 'active' : ''}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="timetable-grid">
          <div className="time-column">
            {Array.from({length: 13}, (_, i) => `${8 + i}:00-${9 + i}:00`).map(time => (
              <div key={time} className="time-slot">{time}</div>
            ))}
          </div>
          
          <div className="classes-grid">
            {Array.from({length: 13}, (_, i) => {
              const currentTime = `${8 + i}:00-${9 + i}:00`;
              const classItem = timetableData[selectedDay]?.find(
                c => c.time.split('-')[0] === currentTime.split('-')[0]
              );
              
              return (
                <div key={currentTime} className="class-slot">
                  {classItem ? (
                    <div className="class-card">
                      <div className="class-time">{classItem.time}</div>
                      <div className="class-name">{classItem.course}</div>
                      <div className="class-details">
                        {classItem.code} | {classItem.lecturer || 'TBA'}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div className="academic-info">
          <h3>2025 Academic Calendar</h3>
          <ul>
            {academicCalendar.semesters.map(sem => (
              <li key={sem.name}>
                <strong>{sem.name}:</strong> {sem.start} to {sem.end}
              </li>
            ))}
          </ul>
          
          <h3>Public Holidays</h3>
          <div className="holidays-grid">
            {academicCalendar.holidays.map(holiday => (
              <div key={holiday.date} className="holiday-card">
                <div className="holiday-date">{holiday.date}</div>
                <div className="holiday-name">{holiday.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ... rest of your existing components ...

  return (
    <motion.div 
      className="profile-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* ... your existing profile components ... */}
    </motion.div>
  );
};

export default StudentProfile;