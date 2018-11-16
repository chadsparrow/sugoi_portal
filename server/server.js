// initialize all modules used in app
const helmet = require("helmet");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const exphbs = require("express-handlebars");
const path = require("path");
const https = require("https");
const fs = require("fs");
const tracker = require('delivery-tracker');
const courier = tracker.courier(tracker.COURIER.FEDEX.CODE);
const cron = require('cron');
const privateKey = fs.readFileSync("./certs/star_sugoi_com.key", "utf8");
const certificate = fs.readFileSync("./certs/star_sugoi_com.crt", "utf8");
const credentials = { key: privateKey, cert: certificate };
const express = require("express");
const logger = require("./helpers/logs");
const moment = require('moment-timezone');
const DateDiff = require('date-diff');


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
const paymentRoutes = require("./routes/payments");

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
  stripStatusCode,
  setPaymentStatus,
  setConfirmDeliveryStatus,
  setShipStatus
} = require("./helpers/hbs");

// MongoDB Connection using .env in docker for credentials

const connectWithRetry = function () {
  return mongoose
    .connect(
      process.env.DB_HOST,
      {
        useNewUrlParser: true,
        autoReconnect: true
      }
    )
    .then(() => logger.info("MongoDB Connected on port 27017..."))
    .catch(err => {
      logger.error(err);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();
mongoose.set("useFindAndModify", false);

const Order = require("./models/Order");

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
      stripStatusCode,
      setPaymentStatus,
      setConfirmDeliveryStatus,
      setShipStatus
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
    store: new MemoryStore({
      checkPeriod: 86400000 //prune expired entries every 24h
    }),
    secret: "s3Cur3",
    key: "sessionid",
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
    maxage: "2m"
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
app.use("/payments", paymentRoutes);

app.use((req, res, next) => {
  const error = new Error("Resource Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  logger.error(error);
  res.status(error.status || 500);
  res.render("error", { error });
});

// cron job to run every 5 mins.. will be every hour to update fedex info in order collection
var cronJob = cron.job("0 * * * *", function () {
  Order.find({ tracking: { $ne: "" }, confirmDeliveryStatus: { $ne: "Delivered" } }).then(foundOrders => {
    console.log(`Updating shipment tracking information on ${foundOrders.length} orders...`);
    foundOrders.forEach(foundOrder => {
      courier.trace(foundOrder.tracking, function (err, result) {
        if (err) {
          foundOrder.confirmDeliveryStatus = "Invalid Tracking #";
        } else {
          foundOrder.confirmDeliveryStatus = result.status;
          foundOrder.checkpoints = result.checkpoints;
          if (foundOrder.confirmDeliveryStatus === "Delivered") {
            foundOrder.confirmDeliveryDate = foundOrder.checkpoints[0].time;
            let date1 = moment(Date.parse(foundOrder.confirmDeliveryDate));
            let date2 = moment(Date.parse(foundOrder.vendorConfirmShip));
            let diff = new DateDiff(date1, date2);
            const shippingLeadTime = diff.days();
            foundOrder.shippingLeadTime = parseInt(shippingLeadTime);
            if (foundOrder.prodLeadTime !== 0 && foundOrder.shippingLeadTime !== 0) {
              foundOrder.totalLeadTime =
                foundOrder.prodLeadTime + foundOrder.shippingLeadTime;
            }
          }
          foundOrder.save(function (err, updatedOrder) {
            if (err) {
              logger.error(err);
            }
          });
        }
      });
    });
    if (foundOrders.length > 0) {
      console.log(`Shipment Tracking information updated`);
    }
  });
});
cronJob.start();

const siteURL = "https://localhost";
const port = process.env.APP_PORT || 3000;
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, (req, res) => {
  logger.info(`App listening on port ${port} - Go to ${siteURL}:${port}/`);
});
