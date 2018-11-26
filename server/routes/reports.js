const express = require("express");
const router = express.Router();
const moment = require("moment-timezone");
const logger = require("../helpers/logs");
const { ensureAuthenticated, ensureAdmin } = require("../helpers/auth");

const Report = require("../models/Reports");

router.get("/", ensureAuthenticated, (req, res) => {
  const currentWeek = moment()
    .tz("America/Vancouver")
    .format("W");
  const currentYear = moment()
    .tz("America/Vancouver")
    .format("YYYY");

  // Returns the ISO week of the date.
  Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return (
      1 +
      Math.round(
        ((date.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7
      )
    );
  };

  function getDateRangeOfWeek(weekNo, y) {
    var d1, numOfdaysPastSinceLastMonday, rangeIsFrom, rangeIsTo;
    d1 = new Date("" + y + "");
    numOfdaysPastSinceLastMonday = d1.getDay() - 1;
    d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
    d1.setDate(d1.getDate() + 7 * (weekNo - d1.getWeek()));
    rangeIsFrom =
      d1.getMonth() + 1 + "-" + d1.getDate() + "-" + d1.getFullYear();
    d1.setDate(d1.getDate() + 6);
    rangeIsTo = d1.getMonth() + 1 + "-" + d1.getDate() + "-" + d1.getFullYear();
    return rangeIsFrom + " to " + rangeIsTo;
  }

  //console.log(getDateRangeOfWeek(currentWeek, currentYear)); //12-21-2015 to 12-27-2015

  let pageTitle = `Custom Reports - ${getDateRangeOfWeek(
    currentWeek,
    currentYear
  )}`;

  console.log(PageTitle);

  res.send("HELLO");

  // Report.find({}).then(orders => {
  //   res.render("reports/index", {
  //     orders,
  //     pageTitle
  //   });
  // });
});

module.exports = router;
