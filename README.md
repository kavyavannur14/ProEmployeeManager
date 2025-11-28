# ProEmployeeManager

A professional Task & Employee management system — React (Vite + Tailwind) frontend and Express + MongoDB backend. Clean UI with dark mode, SweetAlert2 feedback and a minimal REST API for employees and tasks.

---

[Live Demo (local)](http://localhost:5173) • Frontend: [frontend/src/main.jsx](frontend/src/main.jsx) • Backend: [backend/app.js](backend/app.js)

Badges
| CI | License |
|---|---|
| ![local](https://img.shields.io/badge/local-dev-blue) | ![MIT](https://img.shields.io/badge/license-MIT-green) |

Quick links
- App bootstrap: [backend/server.js](backend/server.js)
- Frontend root: [frontend/src/App.jsx](frontend/src/App.jsx)
- Sidebar: [frontend/src/components/Sidebar.jsx](frontend/src/components/Sidebar.jsx)
- Task board: [frontend/src/components/Taskboard.jsx](frontend/src/components/Taskboard.jsx)
- Employee controllers: [`createEmployee`](backend/controllers/employee.js) — [backend/controllers/employee.js](backend/controllers/employee.js)
- Task controllers: [`createTask`](backend/controllers/task.js), [`getTasks`](backend/controllers/task.js), [`updateTask`](backend/controllers/task.js), [`deleteTask`](backend/controllers/task.js) — [backend/controllers/task.js](backend/controllers/task.js)
- Models: [`Employee`](backend/models/employeeSchema.js) — [backend/models/employeeSchema.js](backend/models/employeeSchema.js), [`Task`](backend/models/taskSchema.js) — [backend/models/taskSchema.js](backend/models/taskSchema.js)
- Routes: [backend/routes/employeeRoute.js](backend/routes/employeeRoute.js), [backend/routes/taskRoute.js](backend/routes/taskRoute.js)
- Root .gitignore: [.gitignore](.gitignore) · Frontend .gitignore: [frontend/.gitignore](frontend/.gitignore)

Why show this project
- Clean, presentable UI with dark mode that you can demo on-screen.
- Real backend with MongoDB (Atlas) and Mongoose models — good to show API and data flow.
- Uses SweetAlert2 for consistent action feedback — nice visual polish for demos.
- Easy to run locally and present in interviews or project walkthroughs.

Features (concise)
- Employee CRUD (hire + list)
- Assign, update, delete tasks
- Task priorities, statuses, due dates
- Dark mode and responsive layout
- Toast / modal feedback using SweetAlert2
- TailwindCSS utilities and component-driven UI

Tech stack
- Frontend: React 19, Vite, TailwindCSS, SweetAlert2, react-icons — [frontend/package.json](frontend/package.json)
- Backend: Node (ESM), Express 5, Mongoose, dotenv — [backend/package.json](backend/package.json)
- Database: MongoDB Atlas (MONGO_URI in [backend/config/config.env](backend/config/config.env))

Repository layout (short)
- backend/ — Express API, controllers, models, routes
  - [backend/app.js](backend/app.js) — express app config
  - [backend/server.js](backend/server.js) — server bootstrap
  - [backend/controllers/employee.js](backend/controllers/employee.js)
  - [backend/controllers/task.js](backend/controllers/task.js)
  - [backend/models/employeeSchema.js](backend/models/employeeSchema.js)
  - [backend/models/taskSchema.js](backend/models/taskSchema.js)
- frontend/ — Vite + React UI
  - [frontend/src/App.jsx](frontend/src/App.jsx)
  - [frontend/src/components/Sidebar.jsx](frontend/src/components/Sidebar.jsx)
  - [frontend/src/components/Taskboard.jsx](frontend/src/components/Taskboard.jsx)

Environment (example)
Create `backend/config/config.env` with:
| KEY | EXAMPLE |
|---|---|
| MONGO_URI | mongodb+srv://<user>:<pass>@cluster0.mongodb.net/?retryWrites=true&w=majority |
| PORT | 4000 |
| FRONTEND_URL | http://localhost:5173 |

Run locally (quick)
1. Backend
```bash
cd backend
npm install
npm run dev
```

2. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open frontend at http://localhost:5173 (default Vite port). Backend listens on port from [backend/config/config.env](backend/config/config.env) (default 4000) and exposes API under `/api/v1`.

---

## Useful npm scripts

| Location | Script | Action |
|---|---:|---|
| backend/package.json | dev | nodemon server.js (dev) |
| backend/package.json | start | node server.js |
| frontend/package.json | dev | vite (dev server) |
| frontend/package.json | build | vite build |
| frontend/package.json | preview | vite preview |

Files: [backend/package.json](backend/package.json) · [frontend/package.json](frontend/package.json)

---

## API reference (overview)

All endpoints are mounted under `/api/v1`.

Employees
| Method | Path | Controller |
|---|---|---|
| POST | /api/v1/employee/send | [backend/controllers/employee.js#createEmployee](backend/controllers/employee.js) |
| GET | /api/v1/employee/getall | [backend/controllers/employee.js#getEmployees](backend/controllers/employee.js) |

Tasks
| Method | Path | Controller |
|---|---|---|
| POST | /api/v1/task/send | [backend/controllers/task.js#createTask](backend/controllers/task.js) |
| GET | /api/v1/task/getall | [backend/controllers/task.js#getTasks](backend/controllers/task.js) |
| PUT | /api/v1/task/update/:id | [backend/controllers/task.js#updateTask](backend/controllers/task.js) |
| DELETE | /api/v1/task/delete/:id | [backend/controllers/task.js#deleteTask](backend/controllers/task.js) |

Example: assign a task (curl)
```bash
curl -X POST http://localhost:4000/api/v1/task/send \
  -H "Content-Type: application/json" \
  -d '{"title":"Fix UI","description":"Adjust header spacing","assignedTo":"<EMPLOYEE_ID>","priority":"High","dueDate":"2025-12-09"}'
```

---

## Frontend notes
- Global styles & Tailwind imported in: [frontend/src/main.jsx](frontend/src/main.jsx) and [frontend/src/index.css](frontend/src/index.css)  
- Dark mode toggles the `dark` class on the document via localStorage in [frontend/src/App.jsx](frontend/src/App.jsx) and the toggle UI is in [frontend/src/components/Sidebar.jsx](frontend/src/components/Sidebar.jsx).  

---

## Contributing
- Fork → feature branch → PR with description and screenshots.
- Keep commits atomic and add short, clear messages.
- Run lint and basic manual test before opening PR.

---

## Troubleshooting
- CORS issues: check [backend/app.js](backend/app.js) uses FRONTEND_URL in [backend/config/config.env](backend/config/config.env).  
- Missing employee names: ensure API populates employee fields in [backend/controllers/task.js](backend/controllers/task.js).  
- If UI shows white cards in dark mode, Tailwind dark variants are used in [frontend/src/components/Taskboard.jsx](frontend/src/components/Taskboard.jsx).

---

## License
Add a license file as needed (e.g., `LICENSE.md`).

---
