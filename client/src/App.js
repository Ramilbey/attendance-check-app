import React, { useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState('');

  const fetchAttendance = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/attendance/${studentId}`);
      if (!res.ok) throw new Error('Attendance not found');
      const data = await res.json();
      setAttendance(data);
      setError('');
    } catch (err) {
      setError(err.message);
      setAttendance([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && studentId.trim()) {
      fetchAttendance();
    } else {
      setError('Please enter both name and student ID');
    }
  };

  return (
    <div className="App">
      <h1>📋 Student Attendance Checker</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter your Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <button type="submit">Check Attendance</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {attendance.length > 0 && (
        <div>
          <h2>📅 Attendance History</h2>
          <ul>
            {attendance.map((record) => (
              <li key={record._id}>
                {new Date(record.date).toLocaleDateString()} - {record.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
