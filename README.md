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

Todo-app/
├── models/ # Sequelize models (User, Todo)
├── migrations/ # Database migrations
├── public/ # Static files (CSS, JS)
├── views/ # EJS templates
├── tests/ # Unit & integration tests
├── app.js # Express app configuration
├── index.js # Server entry point
└── package.json # Dependencies & scripts

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

- Database configuration is defined in config/config.json
- Session secret is configured inside app.js
-Ensure PostgreSQL is running and credentials match your configuration



