import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./StudentProfile.css";

// Your exact timetable data
const timetableData = {
  "Monday": [
    { time: "8:00-9:00", course: "Data Structure", code: "S5O'108", lecturer: "Safi K2th Bh4d" },
    { time: "9:00-10:00", course: "(Week 1-15)", code: "A3A630" },
    { time: "12:00-1:00", course: "Computer Architecture", code: "A2-B707", lecturer: "Middle Bh4a Azazek" },
    { time: "2:00-3:00", course: "Interplay and Anti-Generation Lab", code: "MW03222", lecturer: "Young Keong" },
    { time: "3:00-4:00", course: "Fundamentals of Network Technology", code: "S5O'703", lecturer: "Thursday/July Bansasamy" },
    { time: "4:00-5:00", course: "(Week 1-15)", code: "A4A670" },
    { time: "4:00-5:00", course: "Data Structure", code: "S5O'108", lecturer: "Safi K2th Bh4d" },
    { time: "4:00-5:00", course: "(Week 1-15)", code: "A1S630" }
  ],
  "Tuesday": [],
  "Wednesday": [],
  "Thursday": [],
  "Friday": [],
  "Saturday": [
    { time: "9:00-10:00", course: "Introduction of Software Engineering", code: "S5O'107", lecturer: "Al-Fanarch Middle Warsaw: Dilated" },
    { time: "10:00-11:00", course: "(Week 1-15)", code: "A1-SG01" },
    { time: "5:00-6:00", course: "Fundamentals of Network Technology", code: "S5O'703", lecturer: "Thursday/July Bansasamy" },
    { time: "5:00-6:00", course: "(Week 1-15)", code: "A1-A7D" }
  ],
  "Sunday": []
};

const StudentProfile = () => {
  const { studentID } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [todayTimetable, setTodayTimetable] = useState([]);
  const [currentDay, setCurrentDay] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/students/${studentID}/profile`
        );
        if (!response.ok) throw new Error("Failed to fetch student");
        const data = await response.json();
        setStudent(data);
        
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        setCurrentDay(today);
        setTodayTimetable(timetableData[today] || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (studentID) {
      fetchStudent();
    }
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
      <HeaderSection 
        student={student} 
        navigate={navigate} 
        currentDay={currentDay}
        todayTimetable={todayTimetable}
      />
      
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

// Sub-Components
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

const HeaderSection = ({ student, navigate, currentDay, todayTimetable }) => {
  const [showTimetableTooltip, setShowTimetableTooltip] = useState(false);

  return (
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
              {student.name ? student.name.charAt(0).toUpperCase() : '?'}
            </div>
          )}
        </motion.div>
        
        <div className="title-group">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {student.name || 'Unknown Student'}
          </motion.h1>
          <p className="student-id">ID: {student.studentID || 'N/A'}</p>
        </div>
      </div>
      
      <div className="badge-container">
        <motion.div 
          className="profile-badge"
          whileHover={{ scale: 1.05 }}
          onMouseEnter={() => setShowTimetableTooltip(true)}
          onMouseLeave={() => setShowTimetableTooltip(false)}
          onClick={() => navigate('/timetable')}
          style={{ cursor: 'pointer' }}
        >
          {student.program || 'No Program'}
          
          <AnimatePresence>
            {showTimetableTooltip && (
              <motion.div
                className="timetable-tooltip"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <h4>{currentDay}'s Classes</h4>
                {todayTimetable.length > 0 ? (
                  <ul>
                    {todayTimetable.map((classItem, index) => (
                      <li key={index}>
                        <strong>{classItem.time}</strong><br />
                        {classItem.course}<br />
                        {classItem.code} | {classItem.lecturer || 'TBA'}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No classes scheduled today</p>
                )}
                <p className="tooltip-hint">Click to view full timetable</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </header>
  );
};

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
    { label: "Email", value: student.email || 'N/A', isLink: !!student.email },
    { label: "Country", value: student.country || 'N/A' },
    { label: "Contact", value: student.contactNumber || 'N/A', isLink: !!student.contactNumber },
    { label: "Emergency", value: student.emergencyContact || 'N/A' }
  ];

  const academicInfo = [
    { label: "Program", value: student.program || 'N/A' },
    { label: "Batch", value: student.batch || 'N/A' },
    { label: "Year", value: student.yearOfStudy || 'N/A' },
    { label: "Advisor", value: student.advisor || 'N/A' },
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
      {isLink && value !== 'N/A' ? (
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