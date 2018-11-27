const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  reportWeekNumber: {
    type: Number
  },
  reportWeekRange: {
    type: String
  },
  reportMonth: {
    type: Number
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
  },
  signOffs: {
    type: Number
  },
  proofTurnArounds: [],
  avgProofs: {
    type: Number
  },
  outputTurnArounds: [],
  avgOutput: {
    type: Number
  },
  revisionTurnArounds: [],
  avgRevisions: {
    type: Number
  }
});

module.exports = mongoose.model("reports", ReportSchema);
