import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TimetablePage.css";

// Better organized timetable data with consistent structure
const timetableData = {
  Monday: [
    {
      time: "08:00-09:00",
      course: "Data Structure",

      lecturer: "Saif Kifah Jihad",
      location: "Computer Lab 1",
      type: "Lecture",
    },
    {
      time: "12:00-13:00",
      course: "Computer Architecture",

      lecturer: "Hafizah Bte A Razak",
      location: "Lecture Hall B707",
      type: "Lecture",
    },
    {
      time: "15:00-16:00",
      course: "Fundamentals of Network Technology",

      lecturer: "Tharsiniy A/P Ramasamy",
      location: "Network Lab",
      type: "Lecture",
    },
  ],
  Tuesday: [
    {
      time: "14:00-16:00",
      course: "Integrity and Anti-Corruption",
      lecturer: "Young Keong",
      location: "Software Lab",
      type: "Lab",
    },
    {
      time: "16:00-18:00",
      course: "Data Structure",
      lecturer: "Saif Kifah Jihad",
      location: "Computer Lab 1",
      type: "Lab",
    },
  ],
  Wednesday: [
    {
      time: "10:00-12:00",
      course: "Community Service",
      lecturer: "Nurul Hafeeza Bt Juma'ah",
      location: "Community Center",
      type: "Lec",
    },
    {
      time: "16:00-17:00",
      course: "Computer Architecture",
      lecturer: "Hafizah Bte A Razak",
      location: "Tutorial Room 102",
      type: "Tutorial",
    },
  ],
  Thursday: [
    {
      time: "17:00-19:00",
      course: "Fundamentals of Network Technology",
      lecturer: "Tharsiniy A/P Ramasamy",
      location: "Network Lab",
      type: "Lab",
    },
  ],
  Friday: [
    {
      time: "09:00-12:00",
      course: "Introduction to Software Engineering",
      lecturer: "Al-Fawareh Hejab Ma'azer Khaled",
      location: "Lecture Hall G01",
      type: "Lecture",
    },
  ],
};

// Better organized academic calendar
const academicCalendar = {
  semesters: [
    {
      name: "February Semester",
      start: "2025-02-07",
      end: "2025-03-21",
      status: "upcoming",
      weeks: 6,
    },
    {
      name: "April Semester",
      start: "2025-03-28",
      end: "2025-08-01",
      status: "current",
      weeks: 18,
    },
    {
      name: "September Semester",
      start: "2025-09-26",
      end: "2026-01-23",
      status: "upcoming",
      weeks: 17,
    },
  ],
  holidays: [
    { date: "2025-01-01", name: "New Year's Day", type: "public" },
    { date: "2025-02-11", name: "Chinese New Year", type: "public" },
    { date: "2025-03-31", name: "Hari Raya Aidilfitri", type: "public" },
    { date: "2025-05-01", name: "Labour Day", type: "public" },
    { date: "2025-05-12", name: "Wesak Day", type: "public" },
    { date: "2025-06-07", name: "Hari Raya Haji", type: "public" },
    { date: "2025-08-31", name: "Merdeka Day", type: "public" },
    { date: "2025-09-16", name: "Malaysia Day", type: "public" },
    { date: "2025-12-25", name: "Christmas Day", type: "public" },
  ],
};

const TimetablePage = () => {
    const navigate =useNavigate()
  const [selectedDay, setSelectedDay] = useState(
    new Date().toLocaleDateString("en-US", { weekday: "long" })
  );
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState("daily"); // daily, weekly

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Get current class
  const getCurrentClass = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    const todayClasses = timetableData[selectedDay] || [];

    return todayClasses.find((classItem) => {
      const [startTime, endTime] = classItem.time.split("-");
      const [startHour, startMin] = startTime.split(":").map(Number);
      const [endHour, endMin] = endTime.split(":").map(Number);

      const startInMinutes = startHour * 60 + startMin;
      const endInMinutes = endHour * 60 + endMin;

      return (
        currentTimeInMinutes >= startInMinutes &&
        currentTimeInMinutes <= endInMinutes
      );
    });
  };

  const getNextClass = () => {
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

    const todayClasses = timetableData[selectedDay] || [];

    return todayClasses.find((classItem) => {
      const [startTime] = classItem.time.split("-");
      const [startHour, startMin] = startTime.split(":").map(Number);
      const startInMinutes = startHour * 60 + startMin;

      return startInMinutes > currentTimeInMinutes;
    });
  };

  const filteredClasses = (classes) => {
    if (filterType === "all") return classes;
    return classes.filter(
      (classItem) => classItem.type.toLowerCase() === filterType
    );
  };

  const getClassTypeColor = (type) => {
    const colors = {
      Lecture: "bg-blue-100 border-blue-500 text-blue-800",
      Lab: "bg-green-100 border-green-500 text-green-800",
      Tutorial: "bg-yellow-100 border-yellow-500 text-yellow-800",
      Service: "bg-purple-100 border-purple-500 text-purple-800",
    };
    return colors[type] || "bg-gray-100 border-gray-500 text-gray-800";
  };

  const currentClass = getCurrentClass();
  const nextClass = getNextClass();

  return (
    // < className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors" onClick={()=>navigate(-1)}>
              ← Back
            </button>

            <div className="text-center">
              <h1 className="text-2xl md:text-4xl font-bold text-slate-800 mb-2">
                Software Engineering Timetable 
              </h1>
              <div className="flex items-center justify-center gap-2 text-slate-600">
                🕐
                <span>
                  {currentTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="text-slate-400">•</span>
                <span>
                  {currentTime.toLocaleDateString("en-MY", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              🔍
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 bg-slate-100 rounded-lg border-none outline-none"
              >
                <option value="all">All Classes</option>
                <option value="lecture">Lectures</option>
                <option value="lab">Labs</option>
                <option value="tutorial">Tutorials</option>
              </select>
            </div>
          </div>

          {/* Current/Next Class Alert */}
          {(currentClass || nextClass) && (
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between">
                {currentClass ? (
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 rounded-full p-2">📚</div>
                    <div>
                      <p className="text-sm opacity-90">Currently in class</p>
                      <p className="font-semibold text-lg">
                        {currentClass.course}
                      </p>
                      <p className="text-sm opacity-75">
                        {currentClass.location} • {currentClass.time}
                      </p>
                    </div>
                  </div>
                ) : nextClass ? (
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 rounded-full p-2">⏰</div>
                    <div>
                      <p className="text-sm opacity-90">Next class</p>
                      <p className="font-semibold text-lg">
                        {nextClass.course}
                      </p>
                      <p className="text-sm opacity-75">
                        {nextClass.location} • {nextClass.time}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* Day Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.keys(timetableData).map((day) => (
              <button
                key={day}
                className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                  selectedDay === day
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Main Timetable */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            📅
            {selectedDay} Schedule
          </h2>

          <div className="space-y-4">
            {filteredClasses(timetableData[selectedDay] || []).length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <div className="text-6xl mb-4 opacity-50">📚</div>
                <p className="text-lg">
                  No classes scheduled for {selectedDay}
                </p>
                {filterType !== "all" && (
                  <p className="text-sm mt-2">
                    Try changing the filter or select a different day
                  </p>
                )}
              </div>
            ) : (
              filteredClasses(timetableData[selectedDay] || []).map(
                (classItem, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-2xl border-l-4 transition-all hover:shadow-lg transform hover:-translate-y-1 ${getClassTypeColor(
                      classItem.type
                    )}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/80">
                            {classItem.type}
                          </span>
                          <span className="text-sm font-medium opacity-80">
                            {classItem.time}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                          {classItem.course}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm opacity-80">
                          <div className="flex items-center gap-1">
                            👨‍🏫
                            <span>{classItem.lecturer}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            📍
                            <span>{classItem.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            📖
                            <span>{classItem.code}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>

        {/* Academic Calendar */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Semesters */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              2025 Academic Calendar
            </h2>
            <div className="space-y-4">
              {academicCalendar.semesters.map((semester, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 ${
                    semester.status === "current"
                      ? "border-green-200 bg-green-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{semester.name}</h3>
                    {semester.status === "current" && (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm mb-1">
                    {new Date(semester.start).toLocaleDateString("en-MY")} -{" "}
                    {new Date(semester.end).toLocaleDateString("en-MY")}
                  </p>
                  <p className="text-slate-500 text-xs">
                    {semester.weeks} weeks
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Public Holidays */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Public Holidays 2025
            </h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {academicCalendar.holidays.map((holiday, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {holiday.name}
                    </p>
                    <p className="text-sm text-slate-600">
                      {new Date(holiday.date).toLocaleDateString("en-MY", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {holiday.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default TimetablePage;
