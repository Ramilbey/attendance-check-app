// ✅ REWRITTEN & IMPROVED VERSION - TOOLTIP REMOVED
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./StudentProfile.css";

const timetableData = {
  Monday: [
    { time: "8:00-9:00", course: "Data Structure", lecturer: "Safi K2th Bh4d" },
    { time: "9:00-10:00", course: "(Week 1-15)" },
    { time: "12:00-1:00", course: "Computer Architecture", lecturer: "Middle Bh4a Azazek" },
    { time: "2:00-3:00", course: "Integrity and Anti-Corruption",  lecturer: "Young Keong" },
    { time: "3:00-4:00", course: "Fundamentals of Network Technology",  lecturer: "Thursday/July Bansasamy" },
    { time: "4:00-5:00", course: "(Week 1-15)", },
    { time: "4:00-5:00", course: "Data Structure",  lecturer: "Safi K2th Bh4d" },
    { time: "4:00-5:00", course: "(Week 1-15)" }
  ],
//   Saturday: [
//     { time: "9:00-10:00", course: "Introduction of Software Engineering", code: "S5O'107", lecturer: "Al-Fanarch Middle Warsaw: Dilated" },
//     { time: "10:00-11:00", course: "(Week 1-15)", code: "A1-SG01" },
//     { time: "5:00-6:00", course: "Fundamentals of Network Technology", code: "S5O'703", lecturer: "Thursday/July Bansasamy" },
//     { time: "5:00-6:00", course: "(Week 1-15)", code: "A1-A7D" }
//   ]
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
        const res = await fetch(`http://localhost:5000/api/students/${studentID}/profile`);
        if (!res.ok) throw new Error("Failed to fetch student");
        const data = await res.json();
        setStudent(data);

        const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
        setCurrentDay(today);
        setTodayTimetable(timetableData[today] || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (studentID) fetchStudent();
  }, [studentID]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} navigate={navigate} />;
  if (!student) return <EmptyState navigate={navigate} />;

  return (
    <motion.div className="profile-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <HeaderSection {...{ student, navigate, currentDay, todayTimetable }} />
      <TabNavigation {...{ activeTab, setActiveTab }} />
      <AnimatePresence mode="wait">
        <ContentSection key={activeTab} activeTab={activeTab} student={student} />
      </AnimatePresence>
    </motion.div>
  );
};

const LoadingState = () => (
  <div className="profile-container loading-animation">
    <div className="spinner" />
    <p>Loading Student Profile...</p>
  </div>
);

const ErrorState = ({ error, navigate }) => (
  <motion.div className="profile-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <div className="error-card">
      <div className="error-icon">⚠️</div>
      <h3>Error Loading Profile</h3>
      <p>{error}</p>
      <motion.button className="back-button" onClick={() => navigate(-1)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        ← Return
      </motion.button>
    </div>
  </motion.div>
);

const EmptyState = ({ navigate }) => (
  <div className="profile-container empty-state">
    <h3>Profile Not Found</h3>
    <p>Student profile does not exist.</p>
    <motion.button className="back-button" onClick={() => navigate("/dashboard")} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
      ← Dashboard
    </motion.button>
  </div>
);

const HeaderSection = ({ student, navigate, currentDay, todayTimetable }) => {
  return (
    <header className="profile-header">
      <motion.button className="back-button" onClick={() => navigate(-1)} whileHover={{ x: -3 }} whileTap={{ scale: 0.97 }}>
        ← Back
      </motion.button>
      <div className="avatar-title-group">
        <motion.div className="profile-avatar" whileHover={{ rotate: 5 }}>
          {student.avatar ? <img src={student.avatar} alt={student.name} /> : <div className="avatar-placeholder">{student.name?.[0]}</div>}
        </motion.div>
        <div className="title-group">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>{student.name}</motion.h1>
          <p className="student-id">ID: {student.studentID}</p>
        </div>
      </div>
      <div className="badge-container">
        <motion.div
          className="profile-badge"
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/timetable")}
        >
          📅 {student.program || "No Program"}
        </motion.div>
      </div>
    </header>
  );
};

const TabNavigation = ({ activeTab, setActiveTab }) => (
  <nav className="tab-navigation">
    {["personal", "academic"].map(tab => (
      <motion.button
        key={tab}
        className={`tab-btn ${activeTab === tab ? "active" : ""}`}
        onClick={() => setActiveTab(tab)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {tab === "personal" ? "👤 Personal Info" : "🎓 Academic Info"}
      </motion.button>
    ))}
  </nav>
);

const ContentSection = ({ activeTab, student }) => {
  const personal = [
    { label: "Email", value: student.email, isLink: true },
    { label: "Country", value: student.country },
    { label: "Contact", value: student.contactNumber, isLink: true },
    { label: "Emergency", value: student.emergencyContact }
  ];
  const academic = [
    { label: "Program", value: student.program },
    { label: "Batch", value: student.batch },
    { label: "Year", value: student.yearOfStudy },
    { label: "Advisor", value: student.advisor },
    { label: "CGPA", value: student.cgpa ?? "N/A", isHighlight: true }
  ];
  const items = activeTab === "personal" ? personal : academic;
  return (
    <motion.section className={`profile-section ${activeTab}-info`} initial={{ opacity: 0, x: activeTab === "personal" ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: activeTab === "personal" ? 20 : -20 }} transition={{ duration: 0.3 }}>
      <h2>{activeTab === "personal" ? "Personal Information" : "Academic Information"}</h2>
      <div className="info-grid">
        {items.map((item, i) => <InfoItem key={i} {...item} />)}
      </div>
    </motion.section>
  );
};

const InfoItem = ({ label, value = "N/A", isLink = false, isHighlight = false }) => (
  <motion.div className={`info-item ${isHighlight ? "highlight" : ""}`} whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 400 }}>
    <span className="info-label">{label}</span>
    <p className="info-value">
      {isLink && value !== "N/A" ? (
        <a href={label === "Email" ? `mailto:${value}` : `tel:${value}`}>{value}</a>
      ) : value}
    </p>
  </motion.div>
);

export default StudentProfile;