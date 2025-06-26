import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentCheck from "./StudentCheck";
import StudentDashboard from "./StudentDashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-6">
        {/* <h1 className="text-3xl font-bold text-center mb-6">🎓 Attendance Tracker</h1> */}
        <Routes>
          <Route path="/" element={<StudentCheck />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
