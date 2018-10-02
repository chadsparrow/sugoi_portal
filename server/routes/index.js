const express = require("express");
const router = express.Router();

// Initial Load Route
router.get("/", (req, res) => {
  res.render("users/login");
});

module.exports = router;
