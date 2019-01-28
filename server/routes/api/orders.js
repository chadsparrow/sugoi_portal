const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logs");

const { ensureAuthenticated, ensureEditOrders } = require("../../helpers/auth");

// includes model for mongodb
const Order = require("../../models/Order");

// @DESC - GETS JSON DATA OF CERTAIN ORDER NUMBER
// SEC - MUST BE LOGGED IN
router.get("/:orderNum", (req, res) => {
  Order.find(
    { orderNum: req.params.orderNum },
    "accountNum balanceOutstanding client currency estDeliveryDate eventDate isr latestInHand netValue orderNum qty requestDate signedOffDate vendor"
  )
    .then(order => {
      if (order.length == 0) {
        res.status(404).send("No Order Found!");
      } else {
        res.json(order);
      }
    })
    .catch(err => {
      logger.error(err);
    });
});

module.exports = router;
