import React, { useState } from "react";

function StudentCheck() {
  const [studentID, setStudentID] = useState("");
  const [name, setName] = useState("");
  const [summary, setSummary] = useState(null);
  const [absentDetails, setAbsentDetails] = useState([]);
  const [error, setError] = useState("");

  const fetchAttendance = async () => {
    setError("");
    setSummary(null);
    setAbsentDetails([]);

    try {
      const response = await fetch("http://localhost:5000/api/students/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentID, name }),
      });

      if (!response.ok) {
        throw new Error("Student not found or incorrect credentials");
      }

      const data = await response.json();
      setSummary(data.summary);
      setAbsentDetails(data.absentDetails);
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

      {summary && (
        <div className="mt-4 bg-gray-50 p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">📊 Attendance Summary</h2>
          <p><strong>Name:</strong> {summary.name}</p>
          <p><strong>Student ID:</strong> {summary.studentID}</p>
          <p><strong>Total Classes:</strong> {summary.totalClasses}</p>
          <p><strong>Present:</strong> {summary.present}</p>
          <p><strong>Absent:</strong> {summary.absent}</p>
          <p><strong>Attendance %:</strong> {summary.attendancePercentage}</p>

          {absentDetails.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold">📅 Missed Lessons</h3>
              <ul className="list-disc list-inside">
                {absentDetails.map((item, idx) => (
                  <li key={idx}>
                    {new Date(item.date).toLocaleDateString()} - {item.lesson}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StudentCheck;
