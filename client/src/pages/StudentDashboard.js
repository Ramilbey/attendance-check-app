import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function StudentDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { summary, absentDetails } = location.state || {};

  if (!summary) {
    return (
      <div className="text-center">
        <p>No data available. Please log in again.</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => navigate("/")}
        >
          Go Back
        </button>
      </div>
    );
  }

  const { name, studentID, totalClasses, present, absent, attendancePercentage } = summary;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">📊 Attendance Dashboard</h2>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>ID:</strong> {studentID}</p>
      <p><strong>Total Classes:</strong> {totalClasses}</p>
      <p><strong>Present:</strong> {present}</p>
      <p><strong>Absent:</strong> {absent}</p>
      <p><strong>Attendance %:</strong> {attendancePercentage}</p>

      {absentDetails.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mt-6 mb-2">Absent Records:</h3>
          <ul className="list-disc pl-5">
            {absentDetails.map((record, index) => (
              <li key={index}>
                {new Date(record.date).toLocaleDateString()} - {record.lesson}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default StudentDashboard;
