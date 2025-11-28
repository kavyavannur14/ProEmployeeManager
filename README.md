# ProEmployeeManager

A professional Task & Employee management system built with React (Vite + Tailwind) frontend and Express + MongoDB backend. Features clean UI with dark mode support, real-time task assignment, and SweetAlert2 notifications.

---

## Live Demo

[ProEmployeeManager Demo](https://pro-employee-manager.vercel.app/) 

---

## Features

| Feature | Details |
|---------|---------|
| Employee Management | Hire, view, and manage team members |
| Task Assignment | Assign tasks with priorities and due dates |
| Task Tracking | Monitor task status across the team |
| Dark Mode | Full dark theme support with localStorage persistence |
| Real-time Updates | Instant feedback with SweetAlert2 notifications |
| Responsive Design | Works seamlessly on desktop and tablet |
| Employee Search | Quick access to team members from sidebar |

---

## 🛠Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, TailwindCSS, SweetAlert2, react-icons, axios |
| **Backend** | Node.js (ESM), Express 5, Mongoose 9, dotenv |
| **Database** | MongoDB Atlas |
| **Styling** | TailwindCSS with dark mode (class-based) |

---

## 📁Project Structure

```
ProEmployeeManager/
├── backend/
│   ├── config/
│   │   └── config.env
│   ├── controllers/
│   │   ├── employee.js
│   │   └── task.js
│   ├── database/
│   │   └── dbConnection.js
│   ├── models/
│   │   ├── employeeSchema.js
│   │   └── taskSchema.js
│   ├── routes/
│   │   ├── employeeRoute.js
│   │   └── taskRoute.js
│   ├── error/
│   │   └── error.js
│   ├── app.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   └── Taskboard.jsx
│   │   ├── Pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## Environment Setup

Create `backend/config/config.env` with the following variables:

```env
PORT=4000
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ProEmployee?retryWrites=true&w=majority
```

---

##  Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn
- MongoDB Atlas account

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:4000` with hot-reload via nodemon.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173` with Vite HMR.

---

## Available Scripts

| Location | Command | Purpose |
|----------|---------|---------|
| `backend/` | `npm run dev` | Start backend with nodemon (development) |
| `backend/` | `npm start` | Start backend (production) |
| `frontend/` | `npm run dev` | Start Vite dev server |
| `frontend/` | `npm run build` | Build for production |
| `frontend/` | `npm run preview` | Preview production build locally |

---

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/employee/send` | Create new employee |
| GET | `/employee/getall` | Get all employees |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/task/send` | Create and assign task |
| GET | `/task/getall` | Get all tasks (populated with employee details) |
| PUT | `/task/update/:id` | Update task details |
| DELETE | `/task/delete/:id` | Delete task |

### Example: Assign Task

```bash
curl -X POST http://localhost:4000/api/v1/task/send \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Fix Bug #123",
    "description": "Resolve critical login issue",
    "assignedTo": "674f8a2c9d1e2f3g4h5i6j7k",
    "priority": "High",
    "dueDate": "2025-12-15"
  }'
```

---

## UI Highlights

- **Sidebar Navigation** — Quick employee access with selection highlighting
- **Task Board** — Organized task cards with priority badges and due dates
- **Modal Forms** — Clean, validated input forms for hiring and task assignment
- **Dark Mode Toggle** — Seamless theme switching with persistence
- **Responsive Layout** — Optimized for desktop and tablet viewing
- **Toast Notifications** — SweetAlert2 for success, error, and warning feedback

---

## Security Features

- CORS enabled with frontend URL whitelisting
- Input validation on both client and server
- Unique email validation for employees
- Error handling middleware with sanitized error messages
- Environment variables for sensitive data

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Verify `FRONTEND_URL` in [backend/config/config.env](backend/config/config.env) matches your frontend origin |
| Missing employee names in tasks | Ensure [backend/controllers/task.js](backend/controllers/task.js) populates `firstName` and `lastName` fields |
| White task cards in dark mode | Check TailwindCSS dark variants in [frontend/src/components/Taskboard.jsx](frontend/src/components/Taskboard.jsx) |
| Database connection failed | Verify `MONGO_URI` is correct and your IP is whitelisted in MongoDB Atlas |
| Tasks not appearing | Refresh the page or check browser console for API errors |

---

## Notes

- Dark mode preference is saved to localStorage and persists across sessions
- Task dates cannot be set to the past
- Employee email addresses must be unique
- All task assignments require a valid employee ID
- Modal forms validate all required fields before submission

---

## Author

Developed by Kavya Sree Vannurappa Gari

---

## License

This project is open source. Feel free to use and modify as needed.
