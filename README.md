# Student Attendance Tracking System

A full-stack MERN application for Xiamen University Malaysia (XMUM) students to view real-time attendance, personalize profiles, and access academic schedules.

---

## ⚙️ Features

- **Secure Login** using Student ID and full name.
- **Attendance Dashboard** with:
  - Total classes, present/absent count & percentage
  - Interactive pie chart & weekly bar chart (via Recharts)
  - Detailed per-lesson history (subject, date, and time)
- **Profile Page** displaying:
  - Student information (name, country, email, emergency contact)
  - Academic details (major, CGPA, year of study)
  - Clickable major to view timetable
- **Digital Timetable & Calendar** featuring:
  - Weekly class schedule
  - Semester timeline
  - Major-specific public holidays
- **Responsive UI** with nature-inspired theme (light green, blue, gray, yellow, red)
- **Smooth animations & hover effects** powered by Framer Motion

---

## 🛠️ Tech Stack

- **React.js** – front-end UI with component-based architecture and routing (react-router-dom)
- **Node.js** – server-side runtime for event-driven backend
- **Express.js** – lightweight REST API for data handling and validation
- **MongoDB + Mongoose** – NoSQL database for users, attendance, and schedules
- **CSS + Framer Motion** – responsive styling, interactive transitions, and smooth animations

---

## 📥 Setup & Installation

1. **Clone the repository**  
   `git clone https://github.com/Ramilbey/attendance-check-app.git`

2. **Install dependencies**  
   - Frontend: `cd frontend && npm install`  
   - Backend: `cd backend && npm install`

3. **Configure environment variables**  
   - In `/backend/.env`:  
     ```
     MONGO_URI=your_mongo_connection_string
     JWT_SECRET=your_secret_key
     PORT=5000
     ```

4. **Start the app**  
   - Backend: `npm run dev` (auto-reloads on change)  
   - Frontend: `npm start`

5. **Access the app**  
   Visit `http://localhost:3000`

---

## 🧪 Testing

- **API Endpoints** verified with Postman for correct status codes and data formatting.
- **Frontend Interaction** tested manually across browser sizes using DevTools.
- **Performance** optimized (2s+ load times on typical network).
- **Schema validation** ensures secure data flow with Mongoose.
- **Edge cases** (invalid login, missing data) handled gracefully with error messages.

---

## 📚 Academic Context

This project was developed as part of the **Intro to Software Engineering** course at XMUM. It demonstrates:

- End-to-end full-stack skills using MERN
- Software design principles influenced by literature (e.g., Sommerville, Pressman & Maxim)
- Application of UI/UX processes, testing strategies, and project management practices learned in class

---

## 🚀 Future Enhancements

- Implement **authentication** via token-based login (JWT)
- Add **role-based access** for administrators and staff
- Deploy to **Heroku** or **Vercel** with CI/CD pipelines
- Introduce **attendance alerts** and notifications

---

## 🏷️ License & Contact

- **License:** MIT  
- **Maintainer:** Ramil  
- **Email:** [your-email@example.com]

---

Thank you for trying out my app! Feel free to reach out for collaboration or feature suggestions. 😊
