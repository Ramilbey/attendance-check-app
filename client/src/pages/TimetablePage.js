// src/components/TimetablePage.js
import React from 'react';
import { timetableData, academicCalendar } from '../data/timetable';

const TimetablePage = () => {
  const [selectedDay, setSelectedDay] = React.useState('Monday');

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

      {/* Rest of your timetable component code */}
    </div>
  );
};

export default TimetablePage;