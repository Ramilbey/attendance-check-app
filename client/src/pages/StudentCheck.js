import React, { useState } from 'react';

function StudentCheck() {
  const [studentID, setStudentID] = useState('');
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState('');

  const fetchAttendance = async () => {
    setError('');
    setAttendance([]);

    try {
      const response = await fetch(`http://localhost:5000/api/students/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentID, name }), // ✅ Fixed key name
      });

      if (!response.ok) {
        throw new Error('Student not found or incorrect credentials');
      }

      const data = await response.json();
      setAttendance(data.attendance);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-4 rounded shadow">
      <input
        type="text"
        placeholder="Enter Student ID"
        value={studentID}
        onChange={(e) => setStudentID(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
      <button
        onClick={fetchAttendance}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
      >
        Check Attendance
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {attendance.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Attendance Records</h2>
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

export default StudentCheck;
