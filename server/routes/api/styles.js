const express = require('express');
const router = express.Router();
const logger = require('../../helpers/logs');

const { ensureAuthenticated } = require('../../helpers/auth');

// includes model for mongodb
const Style = require('../../models/Style');
const LGStyle = require('../../models/LGStyle');

// @DESC - GETS ALL STYLE INFO FROM SERVER
// SEC - MUST BE LOGGED IN.
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    let styles = [];
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

module.exports = router;
