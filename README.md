Todo App
A full-stack application for managing tasks with user authentication and session management. This app uses PostgreSQL as the database and follows the MVC architecture.

🚀 Features
User authentication with Passport.js.
CSRF protection using csurf.
Task management with CRUD operations.
Flash messages for user feedback.
Unit tests with Jest and Supertest.
Linting and pre-commit hooks with ESLint and Husky.

🚀 Demo
Link:https://todo-app-ba6i.onrender.com

📦 Tech Stack
Frontend: EJS (Embedded JavaScript Templates), Tailwind CSS.
Backend: Node.js, Express.js.
Database: PostgreSQL with Sequelize ORM.


⚙️ Installation
Clone the Repository:

git clone https://github.com/yourusername/todo-app.git
cd todo-app

Install Dependencies:
Backend:
npm install

🛠 Scripts
Start the Development Server:

npm start

This will start the server with nodemon for live reloading.

Start the Production Server:

npm run start:prod

Run Tests:

npm test

Pre-Test Setup:

npm run pretest

This will drop and recreate the test database.

📂 Folder Structure

Todo-app/
├── views/
│   ├── login.ejs
│   ├── header.ejs
│   └── other EJS files...
├── public/
│   ├── css/
│   │   └── stylee.css
├── models/
│   ├── index.js
│   └── other Sequelize models...
├── routes/
│   └── routes.js (or similar)
├── app.js (or server.js)
├── package.json
├── .env
└── other files...

🛡️ Security
Passwords are hashed using bcrypt.
CSRF protection is implemented using csurf.
Sessions are managed securely with express-session.
