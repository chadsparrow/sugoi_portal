const express = require("express");
const router = express.Router();
//const fse = require("fs-extra");
//const multer = require("multer");
//const path = require("path");
//const StreamZip = require("node-stream-zip");
const logger = require("../helpers/logs");
const dayjs = require('dayjs');

const { ensureAuthenticated, ensureEditProofs } = require("../helpers/auth");

const Proof = require("../models/Proof");
const Order = require("../models/Order");

const d = new Date().toISOString();

// router.get(
//   "/uploadform",
//   [ensureAuthenticated, ensureEditProofs],
//   (req, res) => {
//     res.render("proofs/upload");
//   }
// );

// let storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./public/uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       path.basename(file.originalname, path.extname(file.originalname)) +
//         "_" +
//         dayjs(d) +
//         path.extname(file.originalname)
//     );
//   }
// });

// let upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     checkFileType(file, cb);
//   }
// }).single("ziptoUpload");

// function checkFileType(file, cb) {
//   // allowed exts
//   const filetypes = /zip/;
//   // check the ext
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // check mimetype
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb("Error: Zip Files Only!");
//   }
// }

// upload route from upload form - calls multer upload zip to public/uploads
// and extracts files from zip to put into public/3d_assets folder and deletes zip from public/uploads
// router.post("/upload", ensureAuthenticated, (req, res) => {
//   upload(req, res, err => {
//     if (err) {
//       logger.error(err);
//       req.flash("error_msg", err);
//       res.redirect("/proofs/uploadform");
//     } else {
//       if (req.file == undefined) {
//         req.flash("error_msg", "Please Choose a ZIP file!");
//         res.redirect("/proofs/uploadform");
//       } else {
//         let orderNumber = req.file.filename.split("_");
//         orderNumber = orderNumber[0];
//         let zipFilePath = "./" + req.file.path;
//         let destPath = "./public/3d_assets/" + orderNumber;
//         let jsonArray = [];

//         //fse.emptyDirSync(destPath);
//         fse.removeSync(destPath);

//         const zip = new StreamZip({
//           file: zipFilePath,
//           storeEntries: true
//         });

//         zip.on("error", err => {
//           logger.error(err);
//           req.flash("error_msg", err);
//           res.redirect("/proofs/uploadform");
//         });

//         zip.on("ready", () => {
//           zip.extract(null, destPath, (err, count) => {
//             zip.close();
//             fse.removeSync(zipFilePath);
//             Proof.deleteMany({ orderNum: orderNumber }, function(err) {});
//             jsonArray.forEach(jsonFile => {
//               fse
//                 .readJson(jsonFile)
//                 .then(jsonData => {
//                   var gender = jsonData.gender;
//                   if (jsonData.gender === "Womens") {
//                     gender = "Women's";
//                   } else if (jsonData.gender === "Mens") {
//                     gender = "Men's";
//                   }
//                   const newProof = new Proof({
//                     orderNum: jsonData.orderNum,
//                     client: jsonData.client,
//                     isr: jsonData.isr,
//                     itemNumber: jsonData.itemNumber,
//                     styleNumber: jsonData.styleNumber,
//                     styleName: jsonData.styleName,
//                     gender: gender,
//                     sizes: jsonData.sizes,
//                     fabric: jsonData.fabric,
//                     styleCollection: jsonData.styleCollection,
//                     fit: jsonData.fit,
//                     zap: jsonData.zap,
//                     chamois: jsonData.chamois,
//                     features: jsonData.features,
//                     brand: jsonData.brand,
//                     artist: jsonData.artist,
//                     soRef: jsonData.soRef,
//                     cwoRef: jsonData.cwoRef,
//                     prfDate: jsonData.prfDate,
//                     thread: jsonData.thread,
//                     zipper: jsonData.zipper,
//                     contrast: jsonData.contrast,
//                     colors: jsonData.colors,
//                     viewImgLink: jsonData.viewImgLink,
//                     pdfLink: jsonData.pdfLink,
//                     proofOBJLink: jsonData.proofOBJLink,
//                     proofMTLLink: jsonData.proofMTLLink
//                   });

//                   newProof.save(function(err, updateProof) {
//                     if (err) {
//                       logger.error(err);
//                       return;
//                     }
//                   });
//                 })
//                 .catch(err => {
//                   logger.error(err);
//                 });
//             });
//             logger.info(`Proof files uploaded`);
//             req.flash("success_msg", "Proof Uploaded");
//             res.redirect("/orders");
//           });
//         });

//         zip.on("extract", (entry, file) => {
//           let entryName = entry.name;
//           if (entryName.search("proofJSON") != -1) {
//             jsonArray.push(file);
//           }
//         });
//       }
//     }
//   });
// });

router.get("/:id", (req, res) => {
  Proof.findOne({ _id: req.params.id }, ensureAuthenticated, (err, foundProof) => {
    if (err) {
      logger.error(err);
      return;
    }
    Order.findOne({ orderNum: foundProof.orderNum }, (err, mainOrder) => {
      if (err) {
        logger.error(err);
        return;
      }
      res.render("proofs/view", {
        foundProof,
        mainOrder
      });
    });
  });
});

router.get(
  "/qc/:orderNum",
  [ensureAuthenticated, ensureEditProofs],
  (req, res) => {
    Proof.find({ orderNum: req.params.orderNum }, (err, foundProofs) => {
      if (err) {
        logger.error(err);
        return;
      }
      Order.findOne({ orderNum: req.params.orderNum }, (err, mainOrder) => {
        if (err) {
          logger.error(err);
          return;
        }
        res.render("proofs/qc", {
          foundProofs,
          mainOrder
        });
      });
    });
  }
);

router.get(
  "/qc/edit/:id",
  [ensureAuthenticated, ensureEditProofs],
  (req, res) => {
    Proof.findOne({ _id: req.params.id }, (err, foundProof) => {
      if (err) {
        logger.error(err);
      }
      res.render("proofs/qc-edit", {
        foundProof
      });
    });
  }
);

router.put(
  "/qc/edit/:id",
  [ensureAuthenticated, ensureEditProofs],
  (req, res) => {
    const id = req.params.id;
    const { note, noteUser } = req.body;
    const hasQCNote = true;
    const qcnote = {
      noteDate: dayjs(d).format(),
      noteUser: noteUser,
      note: note
    };

    Proof.findOneAndUpdate(
      { _id: id },
      { hasQCNote: hasQCNote, qcnote: qcnote },
      { new: true, upsert: true },
      function (err, updatedProof) {
        if (err) {
          logger.error(err);
          return;
        } else {
          req.flash("success_msg", "Proof QC Updated");
          res.redirect("/proofs/qc/" + updatedProof.orderNum);
        }
      }
    );
  }
);

router.get(
  "/qc/archive/:id",
  [ensureAuthenticated, ensureEditProofs],
  (req, res) => {
    const id = req.params.id;
    Proof.findOne({ _id: id }, function (err, foundProof) {
      if (err) {
        logger.error(err);
        return;
      } else {
        foundProof.hasQCNote = false;
        const qcnote = foundProof.qcnote;
        foundProof.qcnotearchive.push(qcnote);
        foundProof.qcnote = {
          noteDate: null,
          noteUser: null,
          note: null
        };

        foundProof.save(function (err, updatedProof) {
          if (err) {
            logger.error(err);
            return;
          } else {
            req.flash("success_msg", "Proof QC Archived");
            res.redirect("/proofs/qc/" + updatedProof.orderNum);
          }
        });
      }
    });
  }
);

router.get(
  "/qc/archive/view/:orderNum",
  [ensureAuthenticated, ensureEditProofs],
  (req, res) => {
    const orderNum = req.params.orderNum;
    Proof.find({ orderNum: orderNum }, function (err, foundProofs) {
      if (err) {
        logger.error(err);
        return;
      }
      res.render("proofs/qc-archive", {
        foundProofs,
        orderNum
      });
    });
  }
);

module.exports = router;
