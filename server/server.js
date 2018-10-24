// initialize all modules used in app
const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const exphbs = require("express-handlebars");
const bcrypt = require("bcryptjs");

// initializes the app using express
const app = express();
app.use(helmet());

// Load Routes
const userRoutes = require("./routes/users");
const styleRoutes = require("./routes/styles");
const orderRoutes = require("./routes/orders");
const indexRoutes = require("./routes/index");
const prodRoutes = require("./routes/prod");
const proofRoutes = require("./routes/proofs");

// Load User model to create root user if no admin exists in DB
const User = require("./models/User");

// Handlebars Helpers
const {
  getHandle,
  select,
  formatDate,
  setStatusDiv,
  getInstructions,
  checkForQCStatus,
  checkForRevisionStatus,
  catNotes
} = require("./helpers/hbs");

// MongoDB Connection using .env in docker for credentials
mongoose
  .connect(
    process.env.DB_HOST,
    {
      useNewUrlParser: true
    }
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

// initializes EJS middleware
app.engine(
  "handlebars",
  exphbs({
    helpers: {
      getHandle,
      select,
      formatDate,
      setStatusDiv,
      getInstructions,
      checkForQCStatus,
      checkForRevisionStatus,
      catNotes
    },
    defaultLayout: "main"
  })
);

app.set("view engine", "handlebars");

// Passport config
require("./config/passport")(passport);

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method Override
app.use(methodOverride("_method"));

// Connect Flash
app.use(flash());

// Express Session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 28800000 }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// Set static folder
app.use(express.static("public"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Use Routes
app.use("/", indexRoutes);
app.use("/users", userRoutes);
app.use("/styles", styleRoutes);
app.use("/orders", orderRoutes);
app.use("/prod", prodRoutes);
app.use("/proofs", proofRoutes);
//app.use("/uploads", uploads);

app.use((req, res, next) => {
  const error = new Error("Page Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render("error", { error });
});

const port = process.env.APP_PORT || 3000;

// Open port and listen for requests
app.listen(port, (req, res) => {
  let userName = process.env.DB_SUPERUSER;
  userName = userName.toLowerCase();
  let password = process.env.DB_SUPERPASS;
  let admin = true;
  let editOrders = true;
  let editProofs = true;
  let editProd = true;
  let viewProd = true;

  User.findOne({ admin: true }, function(err, user) {
    if (!user) {
      console.log("No Admin User Found - creating root@sugoi.com user...");
      User.findOne({ username: userName }, function(err, user) {
        if (!user) {
          const newUser = new User({
            username: userName,
            password: password,
            admin: admin,
            editOrders: editOrders,
            editProofs: editProofs,
            editProd: editProd,
            viewProd: viewProd
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  console.log("Root User Created!");
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      });
    }
  });

  console.log(`Running on http://${process.env.APP_HOST}:${port}`);
});
