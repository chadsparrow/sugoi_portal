// initialize all modules used in app
const express = require("express");
const mongoose = require("mongoose");
//const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const passport = require("passport");
const fs = require("fs");
//const unzip = require("unzip");
const flash = require("connect-flash");
const session = require("express-session");
const exphbs = require("express-handlebars");
const bcrypt = require("bcryptjs");

// initializes the app using express
const app = express();

// Load Routes
const userRoutes = require("./routes/users");
const styleRoutes = require("./routes/styles");
const orderRoutes = require("./routes/orders");
const indexRoutes = require("./routes/index");
//const uploads = require("./routes/uploads");

// Load User model to create root user if no admin exists in DB
const User = require("./models/User");

// Handlebars Helpers
const { getHandle } = require("./helpers/hbs");

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
    helpers: { getHandle: getHandle },
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Passport config
require("./config/passport")(passport);

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect Flash
app.use(flash());

// Express Session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 3600000 }
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

// // Set Storage engine for file uploads
// const storage = multer.diskStorage({
//   destination: "./public/uploads/",
//   filename: function(req, file, cb) {
//     cb(null, path.basename(file.originalname));
//   }
// });

// // Init Upload Variable
// const upload = multer({
//   storage: storage,
//   fileFilter: function(req, file, cb) {
//     checkFileType(file, cb);
//   }
// }).single("myFile");

// // Checks File Type and mimetype before uploading
// function checkFileType(file, cb) {
//   // Allowed extensions
//   const filetypes = /zip|xml/;
//   // Check Extension
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   //Check MimeType
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb("Error: Zip or XML Files Only!");
//   }
// }

// // upload route from upload form - calls multer upload zip to public/uploads
// // and extracts files from zip to put into public/3d_assets folder and deletes zip from public/uploads
// app.post("/uploads", (req, res) => {
//   upload(req, res, err => {
//     if (err) {
//       res.render("fileupload", {
//         msg: err
//       });
//     } else {
//       if (req.file == undefined) {
//         res.render("fileupload", {
//           msg: "Error: No File Selected!"
//         });
//       } else {
//         // Declare variables
//         //let filePath = "./public/uploads/" + req.file.filename;

//         // Read the file and send to the callback - FOR JSON ONLY
//         // let obj = fs.readFileSync (filePath);
//         // let person = JSON.parse(obj);

//         // res.render("index", {
//         //   msg: "File Uploaded",
//         //   file: req.file.filename,
//         //   data: JSON.stringify(person)
//         // });

//         //FOR ZIP FILES ONLY
//         res.render("fileupload", {
//           msg: req.flash("success_msg", "File Uploaded"),
//           file: req.file.filename
//         });

//         let folderName = req.file.filename.split(".");
//         if (folderName[1] === "zip") {
//           folderName = folderName[0];

//           fs.createReadStream("./public/uploads/" + req.file.filename).pipe(
//             unzip.Extract({
//               path: "./public/3d_assets/" + folderName
//             })
//           );

//           fs.unlinkSync("./public/uploads/" + req.file.filename);
//         }
//       }
//     }
//   });
// });

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

// Open port and listen for requests
app.listen(process.env.APP_PORT, (req, res) => {
  let userName = process.env.DB_SUPERUSER;
  userName = userName.toLowerCase();
  let password = process.env.DB_SUPERPASS;
  let admin = true;
  let editOrders = true;
  let editProofs = true;
  let editProd = true;

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
            editProd: editProd
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

  console.log(
    `REST API running on http://${process.env.APP_HOST}:${process.env.APP_PORT}`
  );
});
