# Faculty Flow — College Project MVP

> **"Organize Work. Save Time. Focus on Teaching."**

Faculty Flow is a centralized task-management web application tailored specifically for college professors and academic instructors. It streamlines the management of teaching responsibilities, research commitments, student grading, departmental meetings, and administrative deadlines into a single, clean academic interface.

---

## 🚀 Key Features Implemented

1. **Academic Dashboard**
   - **Faculty Flow Branding**: Clean header with title and tagline.
   - **Key KPI Counters**: Instant visual breakdown of Total Tasks, Completed Tasks, Pending Tasks, and Overdue Tasks.
   - **Academic Workload Summary**: Real-time distribution across Teaching, Research, Grading, Meeting, and Administrative duties with visual progress bars.
   - **Urgent & Due Tasks Overview**: Priority-sorted widget highlighting upcoming deadlines and overdue tasks.

2. **Full Task Management (CRUD)**
   - **Add Task**: Clean form with Title, Description, Category, Priority, and Due Date.
   - **View Task**: Detailed modal window showing complete task notes, category, priority, due date, status, and creation timestamp.
   - **Edit Task**: Pre-fills the form with existing task data for quick updates.
   - **Delete Task**: Safe deletion with user confirmation prompt.
   - **Toggle Completion**: One-click completion status toggle (`Done` / `Undo`).

3. **Deadline Status Tracking**
   - **Pending**: Tasks awaiting completion.
   - **Completed**: Finished tasks with strikethrough and emerald badge.
   - **Overdue**: Automatic detection when a task's due date is before today and remains incomplete, highlighted with an alert red indicator.

4. **Filterable Task List**
   - Filter by **Category** (All, Teaching, Research, Grading, Meeting, Admin).
   - Filter by **Priority** (All, High, Medium, Low).
   - Filter by **Status** (All, Pending, Completed, Overdue).
   - Real-time search across task titles and descriptions.

5. **Dual-Mode Backend (MongoDB + Demo In-Memory Fallback)**
   - Automatically attempts connection to MongoDB if configured via `MONGODB_URI`.
   - If MongoDB is not running or not installed, the application **seamlessly falls back to an in-memory mock dataset**.
   - Ensures the app is **100% demo-ready** on any judge's or teacher's computer without crashing or requiring database setup.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 6, Plain Modern CSS (No Tailwind, No Redux, No bloated frameworks).
- **Backend**: Node.js, Express.js, CORS.
- **Database**: Mongoose / MongoDB (with zero-config in-memory fallback).
- **Architecture**: REST API architecture.

---

## 📁 Project Structure

```text
faculty-flow-boiler/
├── backend/
│   ├── package.json         # Express, Cors, Mongoose dependencies
│   └── server.js            # REST API endpoints, MongoDB model & in-memory store
├── frontend/
│   ├── index.html           # HTML5 entry with Plus Jakarta Sans typography
│   ├── package.json         # React & Vite setup
│   ├── vite.config.js       # Vite configuration with API proxy
│   └── src/
│       ├── main.jsx         # App root, state management & API integration
│       ├── style.css        # Academic purple/teal CSS styling & responsive layout
│       ├── utils.js         # Deadline status logic, date formatting & categories
│       └── components/
│           ├── Navbar.jsx           # Header, branding & navigation tabs
│           ├── Dashboard.jsx        # Stats counters, workload bars & urgent panel
│           ├── TaskList.jsx         # Search, filters & interactive task cards
│           ├── TaskForm.jsx         # Add/edit task form with validation
│           └── TaskDetailModal.jsx  # Detailed task viewing popup modal
└── README.md
```

---

## 🏃 How to Run the Project

### Prerequisites
- Node.js (v18+) and npm installed.

### 1. Start the Backend API
```bash
cd backend
npm install
npm run dev
```
- API will start at: `http://localhost:5000`
- If MongoDB is running locally (`mongodb://127.0.0.1:27017/faculty-flow`), it will connect automatically. Otherwise, it will seamlessly run in in-memory mode for instant demonstration.

### 2. Start the Frontend
In a separate terminal window:
```bash
cd frontend
npm install
npm run dev
```
- Open `http://localhost:5173` in your browser.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tasks` | Returns all tasks (with status, category, priority, due date) |
| `POST` | `/api/tasks` | Creates a new faculty task |
| `PUT` | `/api/tasks/:id` | Updates an existing task (fields or completion toggle) |
| `DELETE` | `/api/tasks/:id` | Deletes a task by ID |
| `GET` | `/api/health` | Healthcheck returning server status and storage type |

---

## 🔮 Future Scope (Intentionally Excluded from MVP)

To keep this college MVP minimal, functional, and easy to explain during viva, the following advanced features from the pitch deck were intentionally left for future milestones:
- Google Calendar / Outlook two-way sync
- Automated email / SMS / WhatsApp deadline reminders
- Multi-user authentication & role-based access (Dean, HOD, Faculty)
- AI-based lecture note generation or automated syllabus drafting
- University ERP / SIS integration
