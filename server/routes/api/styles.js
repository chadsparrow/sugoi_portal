const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logs");

const { ensureAuthenticated } = require("../../helpers/auth");

// includes model for mongodb
const Style = require("../../models/Style");
const LGStyle = require("../../models/LGStyle");
const SGPrices2019 = require("../../models/SGPricebreaks2019");
const LGPrices2019 = require("../../models/LGPricebreaks2019");
const SGPrices2020 = require("../../models/SGPricebreaks2020");
const LGPrices2020 = require("../../models/LGPricebreaks2020");

// @DESC - GETS ALL STYLE INFO FROM SERVER
// SEC - MUST BE LOGGED IN.
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    if (req.user.lgUser) {
      styles = await LGStyle.find();
    } else {
      styles = await Style.find();
    }
    res.json(styles);
  } catch (err) {
    logger.error(err);
  }
});

// @DESC - GETS SUGOI 2019 Pricebreaks FROM SERVER
// SEC - MUST BE LOGGED IN.
router.get("/sg2019", ensureAuthenticated, async (req, res) => {
  try {
    const prices = await SGPrices2019.find();
    res.json(prices);
  } catch (err) {
    logger.error(err);
  }
});

// @DESC - GETS SUGOI 2020 Pricebreaks FROM SERVER
// SEC - MUST BE LOGGED IN.
router.get("/sg2020", ensureAuthenticated, async (req, res) => {
  try {
    const prices = await SGPrices2020.find();
    res.json(prices);
  } catch (err) {
    logger.error(err);
  }
});

router.get("/lg", ensureAuthenticated, async (req, res) => {
  try {
    const lgStyles = await LGStyle.find();
    res.json(lgStyles);
  } catch (err) {
    logger.error(err);
  }
});

// @DESC - GETS LG SOMBRIO 2019 Pricebreaks FROM SERVER
// SEC - MUST BE LOGGED IN.
router.get("/lg2019", ensureAuthenticated, async (req, res) => {
  try {
    const prices = await LGPrices2019.find();
    res.json(prices);
  } catch (err) {
    logger.error(err);
  }
});

// @DESC - GETS LG SOMBRIO 2020 Pricebreaks FROM SERVER
// SEC - MUST BE LOGGED IN.
router.get("/lg2020", ensureAuthenticated, async (req, res) => {
  try {
    const prices = await LGPrices2020.find();
    res.json(prices);
  } catch (err) {
    logger.error(err);
  }
});

module.exports = router;
