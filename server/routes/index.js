const express = require("express");
const router = express.Router();

// Initial Load Route
router.get("/", (req, res) => {
  res.redirect("orders/");
});

module.exports = router;
