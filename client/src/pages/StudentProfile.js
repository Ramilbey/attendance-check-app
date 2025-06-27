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
        const response = await fetch(
          `http://localhost:5000/api/students/${studentID}/profile`
        );
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

  if (loading) return <div className="profile-container loading-spinner"></div>;
  if (error)
    return (
      <div className="profile-container">
        <div className="error-card">
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="back-button">
            ← Go Back
          </button>
        </div>
      </div>
    );
  if (!student)
    return (
      <div className="profile-container">
        <div className="empty-state">
          <p>No student data found</p>
          <button onClick={() => navigate("/dashboard")} className="back-button">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );

  return (
    <div className="profile-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      <div className="profile-header">
        <div className="profile-avatar">
          {student.avatar ? (
            <img src={student.avatar} alt={student.name} />
          ) : (
            <div className="avatar-placeholder">
              {student.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="profile-title">
          <h1>{student.name}</h1>
          <p className="student-id">ID: {student.studentID}</p>
          <div className="profile-badge">{student.program}</div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section personal-info">
          <h2>
            <span className="section-icon">👤</span>
            Personal Information
          </h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Email</span>
              <p className="info-value">
                <a href={`mailto:${student.email}`}>{student.email}</a>
              </p>
            </div>
            <div className="info-item">
              <span className="info-label">Country</span>
              <p className="info-value">{student.country}</p>
            </div>
            <div className="info-item">
              <span className="info-label">Contact Number</span>
              <p className="info-value">
                <a href={`tel:${student.contactNumber}`}>{student.contactNumber}</a>
              </p>
            </div>
            <div className="info-item">
              <span className="info-label">Emergency Contact</span>
              <p className="info-value">{student.emergencyContact}</p>
            </div>
          </div>
        </div>

        <div className="profile-section academic-info">
          <h2>
            <span className="section-icon">🎓</span>
            Academic Information
          </h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Program</span>
              <p className="info-value">{student.program}</p>
            </div>
            <div className="info-item">
              <span className="info-label">Batch</span>
              <p className="info-value">{student.batch}</p>
            </div>
            <div className="info-item">
              <span className="info-label">Year of Study</span>
              <p className="info-value">{student.yearOfStudy}</p>
            </div>
            <div className="info-item">
              <span className="info-label">Advisor</span>
              <p className="info-value">{student.advisor}</p>
            </div>
            <div className="info-item highlight">
              <span className="info-label">CGPA</span>
              <p className="info-value">{student.cgpa ?? "Not available"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;