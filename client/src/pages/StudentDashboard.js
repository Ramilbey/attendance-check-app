import React from "react";
import { useLocation } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./StudentDashboard.css"; // 👈 Import CSS file

const COLORS = ["#4CAF50", "#F44336"]; // green = present, red = absent

function StudentDashboard() {
  const location = useLocation();
  const { summary, absentDetails } = location.state || {};

  if (!summary)
    return <p className="no-data-message">No data found. Please login again.</p>;

  const chartData = [
    { name: "Present", value: summary.present },
    { name: "Absent", value: summary.absent },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Attendance Dashboard</h1>

      {/* Stats */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <p className="dashboard-label">Total Classes</p>
          <p className="dashboard-value">{summary.totalClasses}</p>
        </div>
        <div className="dashboard-card">
          <p className="dashboard-label">Attendance %</p>
          <p className="dashboard-value">{summary.attendancePercentage}</p>
        </div>
        <div className="dashboard-card present-card">
          <p className="dashboard-label">Present</p>
          <p className="dashboard-value-sm">{summary.present}</p>
        </div>
        <div className="dashboard-card absent-card">
          <p className="dashboard-label">Absent</p>
          <p className="dashboard-value-sm">{summary.absent}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="dashboard-card">
        <h2 className="chart-title">Attendance Chart</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Absent Lessons */}
      <div className="dashboard-card">
        <h2 className="chart-title">Absent Lessons</h2>
        {absentDetails.length === 0 ? (
          <p className="no-absences">No absences 🎉</p>
        ) : (
          <ul className="absent-list">
            {absentDetails.map((item, index) => (
              <li key={index}>
                <strong>{item.lesson}</strong> -{" "}
                {new Date(item.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
