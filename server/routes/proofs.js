const express = require("express");
const router = express.Router();
const fs = require("fs");
const fse = require("fs-extra");
const multer = require("multer");
const path = require("path");
const unzip = require("unzip");

const { ensureAuthenticated, ensureEditProofs } = require("../helpers/auth");

const Proof = require("../models/Proof");

router.get(
  "/uploadform",
  [ensureAuthenticated, ensureEditProofs],
  (req, res) => {
    res.render("proofs/upload");
  }
);

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      path.basename(file.originalname, path.extname(file.originalname)) +
        "_" +
        Date.now() +
        path.extname(file.originalname)
    );
  }
});

let upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single("ziptoUpload");

function checkFileType(file, cb) {
  // allowed exts
  const filetypes = /zip/;
  // check the ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // check mimetype
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Zip Files Only!");
  }
}

// upload route from upload form - calls multer upload zip to public/uploads
// and extracts files from zip to put into public/3d_assets folder and deletes zip from public/uploads
router.post("/upload", ensureAuthenticated, (req, res) => {
  upload(req, res, err => {
    if (err) {
      req.flash("error_msg", err);
      res.redirect("/proofs/uploadform");
    } else {
      if (req.file == undefined) {
        req.flash("error_msg", "Please Choose a ZIP file!");
        res.redirect("/proofs/uploadform");
      } else {
        let orderNumber = req.file.filename.split("_");
        orderNumber = orderNumber[0];
        let zipFilePath = "./" + req.file.path;
        let destPath = "./public/3d_assets/" + orderNumber;

        fse.emptyDirSync(destPath);

        fs.createReadStream(zipFilePath).pipe(
          unzip.Extract({
            path: destPath
          })
        );
        fse.removeSync(zipFilePath);

        req.flash("success_msg", "File Uploaded and Extracted");
        res.redirect("/orders");
      }
    }
  });
  // READ JSON FILE FROM  EXPANDED FOLDER AND IMPORT INTO MONGO "PROOFS" COLLECTION
  //   // let filePath = "./public/3d_assets/" + folderName +"/"+ folderName +".json";
  //   // Read the file and send to the callback - FOR JSON ONLY
  //   // let obj = fs.readFileSync (filePath);
  //   // let person = JSON.parse(obj);
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
});

module.exports = router;
