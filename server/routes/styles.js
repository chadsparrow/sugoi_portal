const express = require("express");
const router = express.Router();

// includes model for mongodb
const Style = require("../models/Style");

// styles route to show all the styles in mongodb
router.get("/", (req, res) => {
  Style.find()
    .sort([["styleNum", "asc"]])
    .then(styles => {
      res.render("styles", {
        styles
      });
    })
    .catch(err => {
      req.flash("error_msg", err);
      res.redirect("/user/login");
    });
});

router.get("/:styleId", (req, res) => {
  const id = req.params.styleId;
  Style.findOne({ LGstyleNum: id })
    .then(style => {
      if (!style) {
        req.flash("error_msg", "Style not found");
        res.redirect("/styles");
      } else {
        res.render("stylesnofilter", {
          style
        });
      }
    })
    .catch(err => {
      req.flash("error_msg", err);
      res.redirect("/styles");
    });
});

module.exports = router;
