const express = require("express");
const router = express.Router();
const logger = require("../helpers/logs");

// includes model for mongodb
const Style = require("../models/Style");

// styles route to show all the styles in mongodb
// router.get("/", (req, res) => {
//   Style.find()
//     .sort([["styleNum", "asc"]])
//     .then(styles => {
//       res.render("styles", {
//         styles
//       });
//     })
//     .catch(err => {
//       logger.error(err);
//       req.flash("error_msg", err);
//       res.redirect("/user/login");
//     });
// });

module.exports = router;
