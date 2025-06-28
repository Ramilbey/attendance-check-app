// src/Timetable.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TimetablePage.css';

// Your exact timetable data
const timetableData = {
  "Monday": [
    { time: "8:00-9:00", course: "Data Structure", code: "S5O'108", lecturer: "Saif Kifah Jihad" },
    { time: "12:00-1:00", course: "Computer Architecture", code: "A2-B707", lecturer: "Hafizah Bte A Razak" },
    { time: "3:00-4:00", course: "Fundamentals of Network Technology", code: "S5O'703", lecturer: "Tharsiniy A/P Ramasamy" },
  ],
    "Tuesday": [
        { time: "2:00-4:00", course: "Interplay and Anti-Generation Lab", code: "MW03222", lecturer: "Young Keong" },
        { time: "4:00-6:00", course: "Data Structure", code: "S5O'108", lecturer: "Saif Kifah Jihad" },
    ],
        
    "Wednesday": [
        { time: "10:00-12:00", course: "Community Service", lecturer: "Nurul Hafeeza Bt Juma'ah", code: 'A2#g09' },
        { time: "4:00-5:00", course: "Computer Architecture", code: "A1-102", lecturer: "Hafizah Bte A Razak" },
        
  ],
    "Thursday": [
        { time: "5:00-7:00", course: "Fundamentals of Network Technology", code: "A1#102", lecturer: "Tharsiniy A/P Ramasamy" }
  ],
    "Friday": [
        { time: "9:00-12:00", course: "Introduction of Software Engineering", code: "A1#G01", lecturer: "Al-Fawareh Hejab Ma'azer Khaled" },
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
    { date: "2025-02-01", name: "Thaipusam" },
    { date: "2025-02-11", name: "Thaipusam" },
    { date: "2025-03-18", name: "Nasul Al-Quma" },
    { date: "2025-03-31", name: "Hari Raya Asifithi" },
    { date: "2025-05-01", name: "Labour Day" },
    { date: "2025-05-12", name: "Weaak Day" },
    { date: "2025-06-07", name: "Hari Raya Hajj" },
    { date: "2025-06-27", name: "Awai Muhammad" },
    { date: "2025-08-31", name: "Meredes Day" },
    { date: "2025-09-01", name: "Replacement Meredes Day" },
    { date: "2025-09-16", name: "Malaysia Day" },
    { date: "2025-10-20", name: "Deepwall" },
    { date: "2025-12-11", name: "Salim of Selangar's Birthday" },
    { date: "2025-12-25", name: "Christmas Day" }
  ]
};

const TimetablePage = () => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(
    new Date().toLocaleDateString('en-US', { weekday: 'long' })
  );

  // Create time slots from 8:00 to 19:00 (7 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 8; i <= 19; i++) {
      const startTime = `${i}:00`;
      const endTime = `${i + 1}:00`;
      slots.push(`${startTime}-${endTime}`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="timetable-container">
      <button 
        onClick={() => navigate(-1)} 
        className="back-button"
      >
        ← Back
      </button>

      <h1 className="timetable-header">Software Engineering Timetable</h1>
      
      <div className="day-selector">
        {Object.keys(timetableData).map(day => (
          <button
            key={day}
            className={`day-button ${selectedDay === day ? 'active' : ''}`}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="timetable-grid">
        <div className="time-column">
          {timeSlots.map(time => (
            <div key={time} className="time-slot">{time}</div>
          ))}
        </div>
        
        <div className="classes-grid">
          {timeSlots.map(timeSlot => {
            const classItem = timetableData[selectedDay]?.find(
              c => c.time === timeSlot
            );
            
            return (
              <div key={timeSlot} className="class-slot">
                {classItem ? (
                  <div className="class-card">
                    <div className="class-time">{classItem.time}</div>
                    <div className="class-name">{classItem.course}</div>
                    <div className="class-code">{classItem.code}</div>
                    <div className="class-lecturer">{classItem.lecturer || 'TBA'}</div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="academic-calendar">
        <h2>2025 Academic Calendar</h2>
        <div className="semesters">
          {academicCalendar.semesters.map((sem, index) => (
            <div key={`${sem.name}-${index}`} className="semester-card">
              <h3>{sem.name}</h3>
              <p>{sem.start} to {sem.end}</p>
            </div>
          ))}
        </div>
        
        <h2>Public Holidays</h2>
        <div className="holidays-grid">
          {academicCalendar.holidays.map((holiday, index) => (
            <div key={`${holiday.date}-${index}`} className="holiday-card">
              <div className="holiday-date">{holiday.date}</div>
              <div className="holiday-name">{holiday.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimetablePage;