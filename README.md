# Todo Application

A full-stack task management application with user authentication, session persistence, and secure data handling.

---

## Description

This project is a robust Todo management system designed to help users organize their daily tasks. Users can create, view, complete, and delete tasks within their own private accounts, ensuring proper data isolation and security.

---

## Features

- **User Authentication** – Secure signup and login using Passport.js (Local Strategy)
- **Password Hashing** – Passwords are securely stored using bcrypt
- **Task Categorization** – Tasks are automatically grouped into:
  - Overdue
  - Due Today
  - Due Later
- **CSRF Protection** – Uses `csurf` middleware to prevent CSRF attacks
- **Session Management** – Persistent login sessions using `express-session`
- **Flash Messages** – Login and action feedback using `connect-flash`

---

## Tech Stack

- **Frontend:** EJS, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL, Sequelize ORM  
- **Authentication & Security:** Passport.js, bcrypt, csurf  
- **Testing:** Jest, Supertest  

---

## Folder Structure
```text
Todo-app/
├── models/ # Sequelize models (User, Todo)
├── migrations/ # Database migrations
├── public/ # Static files (CSS, JS)
├── views/ # EJS templates
├── tests/ # Unit & integration tests
├── app.js # Express app configuration
├── index.js # Server entry point
└── package.json # Dependencies & scripts
```
---

## Installation & Setup

### Clone the repository
```bash
git clone https://github.com/yourusername/todo-app.git
cd todo-app
```
### Install dependencies
```bash
npm install
```
## Environment Variables

- Database configuration is defined in `config/config.json`
- Session secret is configured inside `app.js`
-Ensure PostgreSQL is running and credentials match your configuration

## Run the Project
### Development mode
```bash
npm start
```
### Production mode
```bash
npm run start:prod
```
### Running Tests
```bash
npm run pretest   # Reset test database
npm test          # Run Jest tests
```
---
## API Endpoint
### Authentication
- `GET /signup` – Render signup page
- `POST /users` – Register a new user
- `GET /login` – Render login page
- `POST /session` – Authenticate user
- `GET /signout` – Logout and destroy session
### Todo Management
- `GET /todos` – Fetch categorized todos
- `POST /todos` – Create a new task
- `PUT /todos/:id/markAsCompleted` – Mark task as completed
- `DELETE /todos/:id` – Delete a task
---

## Screenshots / Demo
- **Live Demo**: https://todo-app-ba6i.onrender.com
<p align="center">
  <img src="screenshots/Todo1.png" width="45%" />
  <img src="screenshots/Todo2.png" width="45%" />
</p>

<p align="center">
  <img src="screenshots/Todo3.png" width="45%" />
  <img src="screenshots/Todo5.png" width="45%" />
</p>

---

## Future Improvements
- Role-based access control (RBAC)
- Premium features with payment integration
- Email notifications for overdue tasks


