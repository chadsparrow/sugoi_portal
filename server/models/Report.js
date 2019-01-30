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
    type: Number,
    default: 0
  },
  revisionsCompleted: {
    type: Number,
    default: 0
  },
  outputCompleted: {
    type: Number,
    default: 0
  },
  signOffs: {
    type: Number,
    default: 0
  },
  proofTurnArounds: [],
  avgProofs: {
    type: Number,
    default: 0
  },
  outputTurnArounds: [],
  avgOutput: {
    type: Number,
    default: 0
  },
  revisionTurnArounds: [],
  avgRevisions: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("reports", ReportSchema);
