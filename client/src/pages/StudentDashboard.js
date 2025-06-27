import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import "./StudentDashboard.css";

const COLORS = ["#10b981", "#e5e7eb"];

function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const studentData = location.state;
  const {
    summary,
    presentDetails = [],
    absentDetails = [],
  } = location.state || {};
  const [openSection, setOpenSection] = useState({
    present: true,
    absent: true,
  });
  const [animateIn, setAnimateIn] = useState(false);

  const toggleSection = (section) => {
    setOpenSection((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (!summary)
    return (
      <p className="dashboard-message">No data found. Please login again.</p>
    );

  const chartData = [
    { name: "Present", value: summary.present },
    { name: "Absent", value: summary.absent },
  ];

  const weeklyTrend = [
    { week: "Week 1", present: 4, absent: 1 },
    { week: "Week 2", present: 3, absent: 2 },
    { week: "Week 3", present: 5, absent: 0 },
    { week: "Week 4", present: 4, absent: 1 },
  ];

  const trendChange =
    weeklyTrend.length >= 2
      ? weeklyTrend[weeklyTrend.length - 1].absent -
        weeklyTrend[weeklyTrend.length - 2].absent
      : 0;

  const trendText =
    trendChange < 0
      ? `📈 Attendance improved: ${Math.abs(trendChange)} fewer absents`
      : trendChange > 0
      ? `📉 ${trendChange} more absents than last week`
      : `➖ No change in attendance`;

  return (
    <div className="dashboard-container">
      {/* Student Info Header */}
      <div
        className="student-info-card"
        style={{ backgroundColor: "#f5f3ef   " }}
        onClick={() =>
          navigate(`/student/${summary.studentID}/profile`, {
            state: { student: summary },
          })
        }
        role="button"
        tabIndex={0}
      >
        <div className="student-avatar">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="student-details">
          <h1>{summary.name}</h1>
          <p className="student-id">ID: {summary.studentID}</p>
          <div
            className={`attendance-status ${
              summary.attendancePercentage >= 75 ? "good" : "warning"
            }`}
          >
            {summary.attendancePercentage >= 80 ? "Good" : "Warning"}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-box" style={{ backgroundColor: "#e3f2fd" }}>
          <span>Total Classes</span>
          <strong>{summary.totalClasses}</strong>
        </div>
        <div className="stat-box" style={{ backgroundColor: "#d1e7dd" }}>
          <span>Present</span>
          <strong>{summary.present}</strong>
        </div>
        <div className="stat-box" style={{ backgroundColor: "#f8d7da" }}>
          <span>Absent</span>
          <strong>{summary.absent}</strong>
        </div>
        <div className="stat-box" style={{ backgroundColor: "#f5f5f5" }}>
          <span>Attendance </span>
          <strong>{summary.attendancePercentage}</strong>
        </div>
      </div>

      {/* Charts Grid - Side by Side */}
      <div className="charts-container">
        {/* Attendance Overview */}
        <div className="chart-card">
          <h2>Attendance Overview</h2>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={3}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} classes`, name]}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="chart-card">
          <h2>Weekly Attendance Trend</h2>
          <p className="trend-text">{trendText}</p>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={weeklyTrend}
                margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="present"
                  fill="#10b981"
                  name="Present"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="absent"
                  fill="#9ca3af"
                  name="Absent"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lessons Grid - Side by Side */}
      <div className="lessons-container">
        {/* Present Lessons */}
        <div className="lessons-card">
          <div
            className="lessons-header"
            onClick={() => toggleSection("present")}
          >
            <h3>Present Lessons ({presentDetails.length})</h3>
            <span>{openSection.present ? "▼" : "▶"}</span>
          </div>
          {openSection.present && (
            <div className="lessons-list">
              {presentDetails.map((lesson, index) => (
                <div key={`present-${index}`} className="lesson-item">
                  <span className="lesson-date">{lesson.date}</span>
                  <span className="lesson-subject">{lesson.subject}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Absent Lessons */}
        <div className="lessons-card">
          <div
            className="lessons-header"
            onClick={() => toggleSection("absent")}
          >
            <h3>Absent Lessons ({absentDetails.length})</h3>
            <span>{openSection.absent ? "▼" : "▶"}</span>
          </div>
          {openSection.absent && (
            <div className="lessons-list">
              {absentDetails.map((lesson, index) => (
                <div key={`absent-${index}`} className="lesson-item">
                  <span className="lesson-date">{lesson.date}</span>
                  <span className="lesson-subject">{lesson.subject}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
