import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentCheck.css";

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

      if (!response.ok) throw new Error("Student not found or incorrect credentials");

      const data = await response.json();
      
      // Ensure the response contains all required fields
      const completeData = {
        ...data,
        studentID: studentID, // Make sure studentID is included
        name: name,           // Make sure name is included
      };
      
      navigate("/dashboard", { state: completeData });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchAttendance();
    }
  };

  return (
    <div className="page-container">
      <div className="check-card">
        <h1 className="check-title">XMUM Attendance Portal</h1>

        <input
          type="text"
          placeholder="Student ID"
          value={studentID}
          onChange={(e) => setStudentID(e.target.value)}
          onKeyPress={handleKeyPress}
          className="check-input"
        />
        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          className="check-input"
        />

        <button onClick={fetchAttendance} className="check-button">
          View Attendance
        </button>

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
}

export default StudentCheck;