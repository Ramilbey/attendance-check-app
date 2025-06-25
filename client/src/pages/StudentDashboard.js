import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./StudentDashboard.css";

const COLORS = ["#4cc9f0", "#f72585"];

function StudentDashboard() {
  const location = useLocation();
  const { summary, presentDetails, absentDetails } = location.state || {};
  const [openSection, setOpenSection] = useState({
    present: true,
    absent: true
  });

  const toggleSection = (section) => {
    setOpenSection(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!summary) return <p className="dashboard-message">No data found. Please login again.</p>;

  const chartData = [
    { name: "Present", value: summary.present },
    { name: "Absent", value: summary.absent },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Attendance Dashboard
      </h1>
      <p className="dashboard-subtitle">Track your academic progress and attendance</p>

      <div className="dashboard-grid">
        <div className="stat-box">
          <span>Total Classes</span>
          <strong>{summary.totalClasses}</strong>
        </div>
        <div className="stat-box">
          <span>Present</span>
          <strong>{summary.present}</strong>
        </div>
        <div className="stat-box">
          <span>Absent</span>
          <strong>{summary.absent}</strong>
        </div>
        <div className="stat-box">
          <span>Attendance %</span>
          <strong>{summary.attendancePercentage}%</strong>
        </div>
      </div>

      <div className="chart-section">
        <h2>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 20V10M12 20V4M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Attendance Overview
        </h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={70}
                paddingAngle={3}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value} classes`, name]}
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Legend 
                iconType="circle"
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="data-sections-grid">
        <div className="list-section">
          <h2 onClick={() => toggleSection('present')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.86" stroke="#4cc9f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 4L12 14.01L9 11.01" stroke="#4cc9f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Present Lessons ({presentDetails?.length || 0})
            <span style={{ marginLeft: 'auto' }}>
              {openSection.present ? '▼' : '▶'}
            </span>
          </h2>
          <div 
            className="collapsible-content"
            style={{
              maxHeight: openSection.present ? '1000px' : '0',
              opacity: openSection.present ? 1 : 0
            }}
            data-state={openSection.present ? "open" : "closed"}
          >
            {presentDetails?.length === 0 ? (
              <p style={{ padding: '2rem', color: 'var(--gray)', textAlign: 'center' }}>No presents recorded.</p>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Lesson</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {presentDetails?.map((item, index) => (
                      <tr key={index}>
                        <td>{item.lesson}</td>
                        <td>{new Date(item.date).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</td>
                        <td><span className="status-badge badge-present">Present</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="list-section">
          <h2 onClick={() => toggleSection('absent')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#f72585" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Absent Lessons ({absentDetails?.length || 0})
            <span style={{ marginLeft: 'auto' }}>
              {openSection.absent ? '▼' : '▶'}
            </span>
          </h2>
          <div 
            className="collapsible-content"
            style={{
              maxHeight: openSection.absent ? '1000px' : '0',
              opacity: openSection.absent ? 1 : 0
            }}
            data-state={openSection.absent ? "open" : "closed"}
          >
            {absentDetails?.length === 0 ? (
              <p style={{ padding: '2rem', color: 'var(--gray)', textAlign: 'center' }}>No absences 🎉</p>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Lesson</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {absentDetails?.map((item, index) => (
                      <tr key={index}>
                        <td>{item.lesson}</td>
                        <td>{new Date(item.date).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</td>
                        <td><span className="status-badge badge-absent">Absent</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;