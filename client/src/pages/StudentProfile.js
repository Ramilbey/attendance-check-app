import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./StudentProfile.css";

const StudentProfile = () => {
  const { studentID } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");

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

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} navigate={navigate} />;
  if (!student) return <EmptyState navigate={navigate} />;

  return (
    <motion.div 
      className="profile-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HeaderSection student={student} navigate={navigate} />
      
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <AnimatePresence mode="wait">
        <ContentSection 
          activeTab={activeTab} 
          student={student} 
          key={activeTab} 
        />
      </AnimatePresence>
    </motion.div>
  );
};

// Sub-Components for Perfect Organization
const LoadingState = () => (
  <div className="profile-container">
    <div className="loading-animation">
      <div className="spinner"></div>
      <p>Loading Student Profile...</p>
    </div>
  </div>
);

const ErrorState = ({ error, navigate }) => (
  <motion.div
    className="profile-container"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="error-card">
      <div className="error-icon">⚠️</div>
      <h3>Error Loading Profile</h3>
      <p>{error}</p>
      <motion.button
        onClick={() => navigate(-1)}
        className="back-button"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        ← Return to Previous Page
      </motion.button>
    </div>
  </motion.div>
);

const EmptyState = ({ navigate }) => (
  <div className="profile-container">
    <div className="empty-state">
      <h3>Profile Not Found</h3>
      <p>The requested student profile doesn't exist</p>
      <motion.button
        onClick={() => navigate("/dashboard")}
        className="back-button"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        ← Back to Dashboard
      </motion.button>
    </div>
  </div>
);

const HeaderSection = ({ student, navigate }) => (
  <header className="profile-header">
    <motion.button
      onClick={() => navigate(-1)}
      className="back-button"
      whileHover={{ x: -3 }}
      whileTap={{ scale: 0.97 }}
    >
      ← Back
    </motion.button>
    
    <div className="avatar-title-group">
      <motion.div 
        className="profile-avatar"
        whileHover={{ rotate: 5 }}
      >
        {student.avatar ? (
          <img src={student.avatar} alt={student.name} />
        ) : (
          <div className="avatar-placeholder">
            {student.name.charAt(0).toUpperCase()}
          </div>
        )}
      </motion.div>
      
      <div className="title-group">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {student.name}
        </motion.h1>
        <p className="student-id">ID: {student.studentID}</p>
      </div>
    </div>
    
    <motion.div 
      className="profile-badge"
      whileHover={{ scale: 1.05 }}
    >
      {student.program}
    </motion.div>
  </header>
);

const TabNavigation = ({ activeTab, setActiveTab }) => (
  <nav className="tab-navigation">
    {["personal", "academic"].map((tab) => (
      <motion.button
        key={tab}
        className={`tab-btn ${activeTab === tab ? "active" : ""}`}
        onClick={() => setActiveTab(tab)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {tab === "personal" ? "👤 Personal" : "🎓 Academic"}
      </motion.button>
    ))}
  </nav>
);

const ContentSection = ({ activeTab, student }) => {
  const personalInfo = [
    { label: "Email", value: student.email, isLink: true },
    { label: "Country", value: student.country },
    { label: "Contact", value: student.contactNumber, isLink: true },
    { label: "Emergency", value: student.emergencyContact }
  ];

  const academicInfo = [
    { label: "Program", value: student.program },
    { label: "Batch", value: student.batch },
    { label: "Year", value: student.yearOfStudy },
    { label: "Advisor", value: student.advisor },
    { label: "CGPA", value: student.cgpa ?? "N/A", isHighlight: true }
  ];

  return (
    <motion.section
      className={`profile-section ${activeTab}-info`}
      initial={{ opacity: 0, x: activeTab === "personal" ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: activeTab === "personal" ? 20 : -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2>
        {activeTab === "personal" ? "Personal Information" : "Academic Information"}
      </h2>
      
      <div className="info-grid">
        {(activeTab === "personal" ? personalInfo : academicInfo).map((item) => (
          <InfoItem key={item.label} {...item} />
        ))}
      </div>
    </motion.section>
  );
};

const InfoItem = ({ label, value, isLink = false, isHighlight = false }) => (
  <motion.div
    className={`info-item ${isHighlight ? "highlight" : ""}`}
    whileHover={{ y: -3 }}
    transition={{ type: "spring", stiffness: 400 }}
  >
    <span className="info-label">{label}</span>
    <p className="info-value">
      {isLink ? (
        <a href={label === "Email" ? `mailto:${value}` : `tel:${value}`}>
          {value}
        </a>
      ) : (
        value
      )}
    </p>
  </motion.div>
);

export default StudentProfile;