// initialize all modules used in app
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const methodOverride = require('method-override');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('cookie-session');
const exphbs = require('express-handlebars');
const path = require('path');
const https = require('https');
const fs = require('fs');
const tracker = require('delivery-tracker');
const courier = tracker.courier(tracker.COURIER.FEDEX.CODE);
const cron = require('cron');
const { ensureAuthenticated, ensureEditOrders } = require('./helpers/auth');
const express = require('express');
const logger = require('./helpers/logs');
const dayjs = require('dayjs');
const DateDiff = require('date-diff');

// initializes the app using express
const app = express();

const privateKey = fs.readFileSync('./certs/sugoi.com.key', 'utf8');
const certificate = fs.readFileSync('./certs/ssl_certificate.crt', 'utf8');
let credentials = { key: privateKey, cert: certificate };

// initialize helmet security
app.use(helmet());

// initialize CORS for cross origin (API usage)
app.use(cors());

// Trust Proxies
app.enable('trust proxy');

// Load Route modules
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const prodRoutes = require('./routes/prod');
const proofRoutes = require('./routes/proofs');
const paymentRoutes = require('./routes/payments');
const reportRoutes = require('./routes/reports');
const orderAPIRoutes = require('./routes/api/orders');
const orderRepRoutes = require('./routes/api/reps');
const provTaxRoutes = require('./routes/api/provTax');
const stateRoutes = require('./routes/api/states');
const apiStyleRoutes = require('./routes/api/styles');
const apiGraphicRoutes = require('./routes/api/graphicCodes');
const apiSwatchRoutes = require('./routes/api/swatches');

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
  setShipStatus,
  checkForSignOff,
  netAmount,
  formatPrice,
  getStatusforPayments
} = require('./helpers/hbs');

// MongoDB Connection using .env in docker for credentials
const connectWithRetry = function() {
  return mongoose
    .connect(process.env.DB_HOST, {
      useNewUrlParser: true,
      autoReconnect: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
    .then(() => logger.info('MongoDB Connected...'))
    .catch(err => {
      logger.error(err);
      setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry();

// Load the order model from mongodb
const Order = require('./models/Order');

// initializes Handlebars middleware
app.engine(
  'handlebars',
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
      setShipStatus,
      checkForSignOff,
      netAmount,
      formatPrice,
      getStatusforPayments
    },
    defaultLayout: 'main'
  })
);

//sets the handlebars engine
app.set('view engine', 'handlebars');

// Passport config
require('./config/passport')(passport);

// Body Parser middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

// Method Override
app.use(methodOverride('_method'));

// Connect Flash
app.use(flash());

const sessionOptions = {
  name: 'session',
  secret: process.env.SESSION_SECRET,
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000 //24 hours
};

app.use(session(sessionOptions));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// cron job to run every hour to update all tracking numbers status in the Orders db.
var cronJob = cron.job('0 */4 * * *', function() {
  Order.find({
    tracking: { $nin: ['', null] },
    confirmDeliveryStatus: { $ne: 'Delivered' }
  }).then(foundOrders => {
    if (foundOrders.length > 0) {
      logger.info(`Updating shipment tracking information on ${foundOrders.length} orders...`);
      foundOrders.forEach(foundOrder => {
        courier.trace(foundOrder.tracking, function(err, result) {
          if (err) {
            logger.error(err);
          } else {
            foundOrder.confirmDeliveryStatus = result.status;
            foundOrder.checkpoints = result.checkpoints;
            if (foundOrder.confirmDeliveryStatus === 'Delivered') {
              foundOrder.confirmDeliveryDate = foundOrder.checkpoints[0].time;
              let date1 = dayjs(foundOrder.confirmDeliveryDate);
              let date2 = dayjs(foundOrder.vendorConfirmShip);
              let diff = new DateDiff(date1, date2);
              const shippingLeadTime = diff.days();
              foundOrder.shippingLeadTime = parseInt(shippingLeadTime);
              if (foundOrder.prodLeadTime !== 0 && foundOrder.shippingLeadTime !== 0) {
                foundOrder.totalLeadTime = foundOrder.prodLeadTime + foundOrder.shippingLeadTime;
              }
            }
            foundOrder.save(function(err, updatedOrder) {
              if (err) {
                logger.error(err);
              }
            });
          }
        });
      });
      logger.info(`Shipment Tracking information updated`);
    }
  });
});

cronJob.start();

// Set static folder
app.use(
  express.static(path.join(__dirname, 'public'), {
    maxage: '2m'
  })
);

// Use Routes from above
app.use('/', indexRoutes);
app.use('/admin', adminRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use('/prod', prodRoutes);
app.use('/proofs', proofRoutes);
app.use('/payments', paymentRoutes);
app.use('/reports', reportRoutes);
app.use('/api/orders', orderAPIRoutes);
app.use('/api/reps', orderRepRoutes);
app.use('/api/provTax', provTaxRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/styles', apiStyleRoutes);
app.use('/api/graphicCodes', apiGraphicRoutes);
app.use('/api/swatches', apiSwatchRoutes);

//Vue.js front-end router - uncomment when going to production
app.get(/.*/, [ensureAuthenticated, ensureEditOrders], (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// if the req doesnt match any route above, set an error
app.use((req, res, next) => {
  const error = new Error('Resource Not Found');
  error.status = 404;
  next(error);
});

// if there is an error it will render the error page
app.use((error, req, res, next) => {
  logger.error(error);
  res.status(error.status || 500);
  res.render('error', { error });
});

// sets the port to environment variable PORT or 5000 if not available
const port = process.env.PORT || 5000;

// sets https server with certificates and keys
const httpsServer = https.createServer(credentials, app);

// start the secure server and listen for requests
httpsServer.listen(port, (req, res) => {
  logger.info(`App listening on port ${port}...`);
});
