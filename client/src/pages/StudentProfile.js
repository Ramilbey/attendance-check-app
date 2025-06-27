import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./StudentProfile.css";

function StudentProfile() {
  const { studentID } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/students/${studentID}/profile`);
        if (!response.ok) throw new Error("Failed to fetch student");
        const data = await response.json();
        setStudent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentID]);

  if (loading) return <div className="profile-container">Loading...</div>;
  if (error) return (
    <div className="profile-container">
      <p className="error-message">{error}</p>
      <button onClick={() => navigate(-1)} className="back-button">Go Back</button>
    </div>
  );
  if (!student) return (
    <div className="profile-container">
      <p>No student data found</p>
      <button onClick={() => navigate("/dashboard")} className="back-button">Back to Dashboard</button>
    </div>
  );

  return (
    <div className="profile-container">
      <button onClick={() => navigate(-1)} className="back-button">← Back</button>

      <div className="profile-header">
        <div className="profile-avatar">
          {/* Placeholder Avatar */}
        </div>
        <div className="profile-title">
          <h1>{student.name}</h1>
          <p className="student-id">ID: {student.studentID}</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item"><span>Email</span><p>{student.email}</p></div>
            <div className="info-item"><span>Country</span><p>{student.country}</p></div>
            <div className="info-item"><span>Contact Number</span><p>{student.contactNumber}</p></div>
            <div className="info-item"><span>Emergency Contact</span><p>{student.emergencyContact}</p></div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Academic Information</h2>
          <div className="info-grid">
            <div className="info-item"><span>Program</span><p>{student.program}</p></div>
            <div className="info-item"><span>Batch</span><p>{student.batch}</p></div>
            <div className="info-item"><span>Year of Study</span><p>{student.yearOfStudy}</p></div>
            <div className="info-item"><span>Advisor</span><p>{student.advisor}</p></div>
            <div className="info-item"><span>CGPA</span><p>{student.cgpa ?? "Not available"}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
