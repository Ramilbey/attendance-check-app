import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentCheck() {
  const [studentID, setStudentID] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchAttendance = async () => {
    setError("");

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
      // Redirect to dashboard with attendance data
      navigate("/dashboard", { state: data });
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
    </div>
  );
}

export default StudentCheck;
