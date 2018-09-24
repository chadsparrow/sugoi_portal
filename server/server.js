// initialize all modules used in app
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
const unzip = require("unzip");

// includes model for mongodb
const Style = require("./models/Style");

// Set Storage engine for file uploads
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function(req, file, cb) {
    cb(null, path.basename(file.originalname));
  }
});

// Init Upload Variable
const upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("myFile");

// Checks File Type and mimetype before uploading
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /zip/;
  // Check Extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  //Check MimeType
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Zip Files Only!");
  }
}

// initializes the app using express
const app = express();

// MongoDB Connection
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
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Set static folder
app.use(express.static("public"));

// index route
app.get("/", (req, res) => {
  res.render("index");
});

// upload route from upload form - calls multer upload zip to public/uploads
// and extracts files from zip to put into public/3d_assets folder and deletes zip from public/uploads
app.post("/upload", (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.render("index", {
        msg: err
      });
    } else {
      if (req.file == undefined) {
        res.render("index", {
          msg: "Error: No File Selected!"
        });
      } else {
        // Declare variables
        //let filePath = "./public/uploads/" + req.file.filename;

        // Read the file and send to the callback - FOR JSON ONLY
        // let obj = fs.readFileSync (filePath);
        // let person = JSON.parse(obj);

        // res.render("index", {
        //   msg: "File Uploaded",
        //   file: req.file.filename,
        //   data: JSON.stringify(person)
        // });

        //FOR ZIP FILES ONLY
        res.render("index", {
          msg: "File Uploaded",
          file: req.file.filename
        });

        let folderName = req.file.filename.split(".");
        folderName = folderName[0];

        fs.createReadStream("./public/uploads/" + req.file.filename).pipe(
          unzip.Extract({
            path: "./public/3d_assets/" + folderName
          })
        );

        fs.unlinkSync("./public/uploads/" + req.file.filename);
      }
    }
  });
});

// styles route to show all the styles in mongodb
app.get("/styles", (req, res) => {
  Style.find()
    .sort([["styleNum", "asc"]])
    .then(styles => {
      res.render("styles", {
        styles: styles
      });
    });
});

// Open port and listen for requests
app.listen(process.env.APP_PORT, (req, res) => {
  console.log(
    `REST API running on http://${process.env.APP_HOST}:${process.env.APP_PORT}`
  );
});
