import React from "react";
import StudentCheck from "./StudentCheck";
import './App.css'


function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">🎓 Attendance Tracker</h1>
      <StudentCheck />
    </div>
  );
}

export default App;
