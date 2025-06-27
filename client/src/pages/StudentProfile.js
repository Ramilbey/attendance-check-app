import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "./StudentProfile.css";

const COLORS = ["#10b981", "#e5e7eb"];

function StudentProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const studentData = location.state;

  if (!studentData) {
    return (
      <div className="profile-container">
        <p className="error-message">No student data found. Please go back and select a student.</p>
        <button onClick={() => navigate("/dashboard")} className="back-button">
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Extract data from studentData with default values
  const { 
    name = '',
    studentID = '',
    present = 0,
    absent = 0,
    attendancePercentage = 0,
    totalClasses = 0,
    presentDetails = [],
    absentDetails = []
  } = studentData;

  // Additional profile data (either from API or default values)
  const profileData = {
    fullName: name,
    studentId: studentID,
    email: `${studentID.toLowerCase()}@xmu.edu.my`,
    country: "Malaysia",
    yearOfStudy: "Year " + Math.ceil(totalClasses/30), // Example calculation
    program: "Computer Science",
    batch: "20" + studentID.substring(0, 2), // Example: ID starts with year
    cgpa: "3." + Math.floor(Math.random() * 5), // Example random CGPA
    currentGPA: "3." + Math.floor(Math.random() * 9), // Example random GPA
    advisor: "Dr. Smith",
    contactNumber: "+60 12-345 6789",
    emergencyContact: "Parent/Guardian: +60 12-987 6543"
  };

  const chartData = [
    { name: "Present", value: present },
    { name: "Absent", value: absent },
  ];

  return (
    <div className="profile-container">
      <button onClick={() => navigate("/dashboard")} className="back-button">
        ← Back to Dashboard
      </button>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="profile-title">
          <h1>{profileData.fullName}</h1>
          <p className="student-id">{profileData.studentId}</p>
          <div className={`attendance-status ${attendancePercentage >= 75 ? 'good' : 'warning'}`}>
            Attendance Status: {attendancePercentage >= 80 ? 'Good' : 'Needs Improvement'} ({attendancePercentage}%)
          </div>
        </div>
      </div>

      <div className="profile-content">
        {/* Left Column - Personal Info */}
        <div className="profile-section personal-info">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{profileData.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Country</span>
              <span className="info-value">{profileData.country}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Year of Study</span>
              <span className="info-value">{profileData.yearOfStudy}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Program</span>
              <span className="info-value">{profileData.program}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Batch</span>
              <span className="info-value">{profileData.batch}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Contact Number</span>
              <span className="info-value">{profileData.contactNumber}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Emergency Contact</span>
              <span className="info-value">{profileData.emergencyContact}</span>
            </div>
          </div>
        </div>

        {/* Right Column - Academic Info */}
        <div className="profile-section academic-info">
          <h2>Academic Information</h2>
          
          <div className="academic-stats">
            <div className="gpa-display">
              <div className="gpa-item">
                <span className="gpa-label">CGPA</span>
                <span className="gpa-value">{profileData.cgpa}</span>
              </div>
              <div className="gpa-item">
                <span className="gpa-label">Current GPA</span>
                <span className="gpa-value">{profileData.currentGPA}</span>
              </div>
            </div>

            <div className="attendance-chart">
              <h3>Attendance Summary</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={50}
                      paddingAngle={3}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                      {attendancePercentage}%
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="academic-details">
            <div className="detail-item">
              <span className="detail-label">Academic Advisor</span>
              <span className="detail-value">{profileData.advisor}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Total Classes</span>
              <span className="detail-value">{totalClasses}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Present</span>
              <span className="detail-value">{present}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Absent</span>
              <span className="detail-value">{absent}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;