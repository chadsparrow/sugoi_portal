const express = require("express");
const router = express.Router();
const fs = require("fs");
const fse = require("fs-extra");
const multer = require("multer");
const path = require("path");
const StreamZip = require("node-stream-zip");

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
        let jsonArray = [];

        fse.emptyDirSync(destPath);

        const zip = new StreamZip({
          file: zipFilePath,
          storeEntries: true
        });

        zip.on("error", err => {
          req.flash("error_msg", err);
          res.redirect("/proofs/uploadform");
        });

        zip.on("ready", () => {
          zip.extract(null, destPath, (err, count) => {
            zip.close();
            fse.removeSync(zipFilePath);
            Proof.deleteMany({ orderNum: orderNumber }, function(err) {});
            jsonArray.forEach(jsonFile => {
              fse
                .readJson(jsonFile)
                .then(jsonData => {
                  const newProof = new Proof({
                    orderNum: jsonData.orderNum,
                    client: jsonData.client,
                    isr: jsonData.isr,
                    itemNumber: jsonData.itemNumber,
                    styleNumber: jsonData.styleNumber,
                    styleName: jsonData.styleName,
                    gender: jsonData.gender,
                    sizes: jsonData.sizes,
                    fabric: jsonData.fabric,
                    styleCollection: jsonData.styleCollection,
                    fit: jsonData.fit,
                    zap: jsonData.zap,
                    chamois: jsonData.chamois,
                    features: jsonData.features,
                    brand: jsonData.brand,
                    artist: jsonData.artist,
                    soRef: jsonData.soRef,
                    cwoRef: jsonData.cwoRef,
                    prfDate: jsonData.prfDate,
                    thread: jsonData.thread,
                    zipper: jsonData.zipper,
                    contrast: jsonData.contrast,
                    colors: jsonData.colors,
                    viewImgLink: jsonData.viewImgLink,
                    pdfLink: jsonData.pdfLink,
                    proofOBJLink: jsonData.proofOBJLink,
                    proofMTLLink: jsonData.proofMTLLink
                  });

                  newProof.save(function(err, updateProof) {
                    if (err) {
                      console.log(err);
                    }
                  });
                })
                .catch(err => {
                  console.log(err);
                });
            });
            req.flash("success_msg", "Proof Uploaded");
            res.redirect("/orders");
          });
        });

        zip.on("extract", (entry, file) => {
          let entryName = entry.name;
          if (entryName.search("proofJSON") != -1) {
            jsonArray.push(file);
          }
        });
      }
    }
  });
});

module.exports = router;
