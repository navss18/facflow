# MASTER PROMPT FOR CLAUDE

Build the Faculty Flow project from this boilerplate. Keep it SIMPLE, DEMO-READY, and EASY TO EXPLAIN.

Project purpose:
Faculty Flow is a task-management app for faculty to manage lectures, assignments, meetings, exams, research and administrative work in one place.

Use only:
- React + Vite
- Node.js + Express
- MongoDB/Mongoose only if persistence is needed
- Plain CSS
Do NOT add Redux, Next.js, Tailwind, Docker, microservices, complex AI, OAuth, or unnecessary libraries.

Core MVP:
1. Dashboard
2. Add task
3. View tasks
4. Edit/delete task
5. Mark task complete
6. Priority: Low/Medium/High
7. Category: Teaching/Research/Grading/Meeting/Admin
8. Due date
9. Simple deadline reminder/status
10. Basic workload summary

Pages:
- Dashboard
- Tasks
- Add/Edit Task

Task fields:
title, description, category, priority, dueDate, completed

Backend API:
GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id

Keep the UI clean and academic. Use the Faculty Flow name and the tagline:
"Organize Work. Save Time. Focus on Teaching."

Important:
- First make the basic working project.
- Do not implement advanced features unless the basic MVP works.
- Use reusable components but keep the folder structure small.
- Add clear error handling.
- Use mock/in-memory data if MongoDB is not configured.
- Do not change the requested stack.
- Do not create unnecessary files.
- Give exact commands to run.
- Make the project suitable for a college project/demo and easy to explain in viva.

After implementation, provide:
1. Final folder structure
2. Setup commands
3. API list
4. Short explanation of each major file
5. Future enhancement list

The PPT describes Faculty Flow as a centralized faculty task manager with calendar sync, smart task prioritization, deadline alerts and workload/time analytics. For this version, implement only simple versions of these ideas; keep advanced integrations as future scope.
