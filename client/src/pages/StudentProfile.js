import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./StudentProfile.css";

function StudentProfile() {
  const { studentID } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [student, setStudent] = useState(location.state?.student || null);
  const [loading, setLoading] = useState(!location.state?.student);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location.state?.student) {
      const fetchStudent = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/students/${studentID}/profile`
          );
          if (!response.ok) throw new Error('Failed to fetch student');
          setStudent(await response.json());
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchStudent();
    }
  }, [studentID, location.state]);

  if (loading) return <div className="profile-container">Loading...</div>;
  if (error) return (
    <div className="profile-container">
      <p className="error-message">{error}</p>
      <button onClick={() => navigate(-1)} className="back-button">
        Go Back
      </button>
    </div>
  );
  if (!student) return (
    <div className="profile-container">
      <p>No student data found</p>
      <button onClick={() => navigate('/dashboard')} className="back-button">
        Back to Dashboard
      </button>
    </div>
  );

  return (
    <div className="profile-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      <div className="profile-header">
        <div className="profile-avatar">
          {/* Your avatar SVG */}
        </div>
        <div className="profile-title">
          <h1>{student.name}</h1>
          <p className="student-id">ID: {student.studentID}</p>
        </div>
      </div>

      <div className="profile-content">
        {/* Personal Info Section */}
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span>Email</span>
              <p>{student.email}</p>
            </div>
            {/* Other personal info fields */}
          </div>
        </div>

        {/* Academic Info Section */}
        <div className="profile-section">
          <h2>Academic Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span>Program</span>
              <p>{student.program}</p>
            </div>
            {/* Other academic info fields */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;