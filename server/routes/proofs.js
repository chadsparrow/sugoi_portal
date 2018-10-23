const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const unzip = require("unzip");

// includes model for mongodb
const Order = require("../models/Order");
const Proof = require("../models/Proof");

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
}).single("ziptoUpload");

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

router.get("/upload", (req, res) => {
  res.render("proofs/upload");
});

// upload route from upload form - calls multer upload zip to public/uploads
// and extracts files from zip to put into public/3d_assets folder and deletes zip from public/uploads
router.post("/upload", (req, res) => {
  upload(req, res, err => {
    if (err) {
      req.flash("error_msg", err);
      res.redirect("/proofs/upload");
    } else {
      if (req.file == undefined) {
        req.flash("error_msg", "Please choose a ZIP file");
        res.redirect("/proofs/upload");
      } else {
        let folderName = req.file.filename.split(".");
        if (folderName[1] === "zip") {
          folderName = folderName[0];
          fs.createReadStream("./public/uploads/" + req.file.filename).pipe(
            unzip.Extract({
              path: "./public/3d_assets/" + folderName
            })
          );
          fs.unlinkSync("./public/uploads/" + req.file.filename);
          req.flash("success_msg", "ZIP Uploaded and Expanded");
          res.redirect("/orders");
        }

        // READ JSON FILE FROM  EXPANDED FOLDER AND IMPORT INTO MONGO "PROOFS" COLLECTION
        //   // let filePath = "./public/3d_assets/" + folderName +"/"+ folderName +".json";
        //   // Read the file and send to the callback - FOR JSON ONLY
        //   // let obj = fs.readFileSync (filePath);
        //   // let person = JSON.parse(obj);
      }
      //   // Declare variables
      //   //let filePath = "./public/uploads/" + req.file.filename;
      //   // Read the file and send to the callback - FOR JSON ONLY
      //   // let obj = fs.readFileSync (filePath);
      //   // let person = JSON.parse(obj);
      //   // res.render("index", {
      //   //   msg: "File Uploaded",
      //   //   file: req.file.filename,
      //   //   data: JSON.stringify(person)
      //   // });
    }
  });
});

module.exports = router;
