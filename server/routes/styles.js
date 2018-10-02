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
    });
});

router.get("/:styleId", (req, res) => {
  const id = req.params.styleId;
  Style.find({ LGstyleNum: id }).then(styles => {
    res.render("stylesnofilter", {
      styles
    });
  });
});

module.exports = router;
