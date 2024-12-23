const express = require("express");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const flash = require("connect-flash");
const bcrypt = require("bcrypt");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const { Todo, User } = require("./models");

const app = express();

// 1. Session Middleware - Initialize session first to store session data
app.use(
  session({
    secret: "my-super-key-123456789", // Secret for session signing
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // Session expiration time (1 day)
  })
);

// 2. Flash Middleware - Comes after session as it relies on session to store flash messages
app.use(flash());

// 3. Passport Middleware - Initialize Passport for user authentication
app.use(passport.initialize());
app.use(passport.session());

// 4. BodyParser & CSRF Middleware
app.use(bodyParser.json()); // For parsing JSON bodies
app.use(express.urlencoded({ extended: false })); // For parsing URL-encoded data
app.use(cookieParser("shh  some secret string")); // Cookie parser for signed cookies
app.use(csrf({ cookie: true })); // CSRF protection using tokens in cookies

// Set EJS as the view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Serve static files (like images, CSS, JavaScript)
app.use(express.static(path.join(__dirname, "public")));

// Passport Local Strategy for authentication
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } });
        if (user && (await bcrypt.compare(password, user.password))) {
          return done(null, user); // Authentication success
        } else {
          return done(null, false, { message: "Invalid email or password!" }); // Authentication failure
        }
      } catch (error) {
        return done(error); // Error handling
      }
    }
  )
);

// Serialize and deserialize user for session
passport.serializeUser((user, done) => {
  console.log("Serializing user in session", user.id);
  done(null, user.id); // Store user ID in session
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => done(null, user)) // Retrieve user by ID from session
    .catch((error) => done(error, null)); // Error handling
});

// Routes

// Root route to render the index page with CSRF token
app.get("/", (req, res) => {
  res.render("index", {
    title: "Todo Application",
    csrfToken: req.csrfToken(),
  });
});

// Login route and authentication
app.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
    csrfToken: req.csrfToken(),
    message: {
      success: req.flash("success"),
      error: req.flash("error"),
    },
  });
});

// Handle user login via POST
app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login", // Redirect on failure
    failureFlash: true, // Use flash messages on failure
  }),
  (req, res) => {
    req.flash("success", "Login successful!"); // Flash message for success
    res.redirect("/todos"); // Redirect to todos page
  }
);

// Signout route to log the user out and clear the session
app.get("/signout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err); // Handle logout error
    res.redirect("/"); // Redirect to the home page
  });
});

// Signup route for rendering signup form
app.get("/signup", (req, res) => {
  res.render("signup", {
    title: "Signup",
    csrfToken: req.csrfToken(),
  });
});

// Handle user signup and create a new user
app.post("/users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash password
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
    });
    req.login(user, (err) => {
      if (err) return res.status(500).send("Error during login"); // Handle login error
      res.redirect("/todos"); // Redirect to todos page
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating user"); // Handle user creation error
  }
});

// Todo Routes

// Fetch all todos for the logged-in user
app.get(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(), // Ensure user is logged in
  async (req, res) => {
    try {
      const loggedInUser = req.user.id;
      const completedTodos = await Todo.completedList(loggedInUser);
      const overdue = await Todo.overdueList(loggedInUser);
      const dueToday = await Todo.dueTodayList(loggedInUser);
      const dueLater = await Todo.dueLaterList(loggedInUser);
      res.render("todos", {
        title: "Todo Application",
        overdue,
        dueToday,
        dueLater,
        completedTodos,
        csrfToken: req.csrfToken(),
      });
    } catch (error) {
      console.error("Error fetching todos:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Create a new todo
app.post("/todos", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  try {
    await Todo.addTodo({
      title: req.body.title,
      dueDate: req.body.dueDate,
      userId: req.user.id,
    });
    res.redirect("/todos");
  } catch (error) {
    console.log(error);
    res.status(422).json(error);
  }
});

// Mark a todo as completed
app.put(
  "/todos/:id/markAsCompleted",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    try {
      const todo = await Todo.findByPk(req.params.id);
      if (!todo) return res.status(404).json({ message: "Todo not found" });

      const updatedTodo = await todo.markAsCompleted(req.user.id);
      res.json(updatedTodo);
    } catch (error) {
      console.log(error);
      res.status(422).json(error);
    }
  }
);

app.put(
  "/todos/:id/markAsUncompleted",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    try {
      const todo = await Todo.findByPk(req.params.id);
      if (!todo) return res.status(404).json({ message: "Todo not found" });

      const updatedTodo = await todo.markAsUncompleted(req.user.id);
      res.json(updatedTodo);
    } catch (error) {
      console.log(error);
      res.status(422).json(error);
    }
  }
);

// Delete a todo by ID
app.delete(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    try {
      await Todo.remove(req.params.id, req.user.id);
      res.json(true); // Return success response
    } catch (error) {
      res.status(422).json(error); // Handle deletion error
    }
  }
);

module.exports = app;
