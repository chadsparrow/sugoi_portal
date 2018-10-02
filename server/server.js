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

// initializes the app using express
const app = express();

// Load Routes
const userRoutes = require("./routes/users");
const styleRoutes = require("./routes/styles");
const orderRoutes = require("./routes/orders");
const indexRoutes = require("./routes/index");
//const uploads = require("./routes/uploads");

// Handlebars Helpers
//const { isAdmin } = require("./helpers/hbs");

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
    //helpers: {},
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Passport config
require("./config/passport")(passport);

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

// Connect Flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
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

// Use Routes
app.use("/", indexRoutes);
app.use("/users", userRoutes);
app.use("/styles", styleRoutes);
app.use("/orders", orderRoutes);
//app.use("/uploads", uploads);

// Open port and listen for requests
app.listen(process.env.APP_PORT, (req, res) => {
  console.log(
    `REST API running on http://${process.env.APP_HOST}:${process.env.APP_PORT}`
  );
});
