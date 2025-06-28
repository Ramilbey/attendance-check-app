import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentCheck from "./StudentCheck";
import StudentDashboard from "./StudentDashboard";
import StudentProfile from "./StudentProfile";
import TimetablePage from "./TimetablePage";  

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-6">
        <Routes>
          <Route path="/" element={<StudentCheck />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/student/:studentID" element={<StudentProfile />} />
          <Route path="/timetable" element={<TimetablePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;