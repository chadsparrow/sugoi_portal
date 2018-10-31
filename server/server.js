// initialize all modules used in app
const helmet = require("helmet");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const exphbs = require("express-handlebars");
const path = require("path");
const https = require("https");
const fs = require("fs");
const privateKey = fs.readFileSync("./certs/star_sugoi_com.key", "utf8");
const certificate = fs.readFileSync("./certs/star_sugoi_com.crt", "utf8");
const credentials = { key: privateKey, cert: certificate };
const express = require("express");

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

// Handlebars Helpers
const {
  getHandle,
  select,
  formatDate,
  setStatusDiv,
  getInstructions,
  checkForQCStatus,
  checkForRevisionStatus,
  catNotes,
  stripStatusCode
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
      catNotes,
      stripStatusCode
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
    secret: "s3Cur3",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 28800000,
      secure: true,
      httpOnly: true
    }
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
app.use(
  express.static(path.join(__dirname, "public"), {
    maxage: "10m"
  })
);

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

app.use((req, res, next) => {
  const error = new Error("Page Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render("error", { error });
});

if (process.env.NODE_ENV == "development") {
  siteURL = "https://dev.sugoi.com";
} else if (process.env.NODE_ENV == "production") {
  siteURL = "https://proofs.sugoi.com";
}

const port = process.env.APP_PORT || 3000;

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, (req, res) => {
  console.log(`App listening on port ${port} - Go to ${siteURL}:${port}/`);
});
