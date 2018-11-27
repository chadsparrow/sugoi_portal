const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  reportWeekNumber: {
    type: Number
  },
  reportWeekRange: {
    type: String
  },
  reportYear: {
    type: Number
  },
  proofsCompleted: {
    type: Number
  },
  revisionsCompleted: {
    type: Number
  },
  outputCompleted: {
    type: Number
  }
});

module.exports = mongoose.model("reports", ReportSchema);
