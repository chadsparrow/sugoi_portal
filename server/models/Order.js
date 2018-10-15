const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Order Schema
const OrderSchema = new Schema({
  orderNum: {
    type: String,
    required: true
  },
  currentStatus: {
    type: String,
    enum: [
      "A. Waiting for Proof",
      "B. Proof Started",
      "C. Proof - Waiting on Someone else",
      "D. Proof Ready for QC",
      "E. Proof QC Complete",
      "F. Proof Complete",
      "G. Waiting for Revision",
      "H. Revision - Waiting on Someone else",
      "I. Revision Started",
      "J. Revision Ready for QC",
      "K. Revision QC Complete",
      "L. Revision Complete",
      "M. Waiting for Output",
      "N. Output - Waiting on Someone else",
      "O. Output Started",
      "P. Output Ready for QC",
      "Q. Output QC Complete",
      "R. Waiting for PNT",
      "S. PNT Ready for QC",
      "T. PNT QC Complete",
      "U. Uploaded",
      "V. Sent to Vendor",
      "W. CANCELLED"
    ],
    required: true
  },
  priority: {
    type: String,
    enum: ["", "VIP", "RUSH"]
  },
  requestDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  eventDate: {
    type: Date,
    default: null
  },
  latestInHand: {
    type: Date,
    default: null
  },
  isr: {
    type: String,
    required: true
  },
  client: {
    type: String,
    required: true
  },
  instructions: [
    {
      date: {
        type: Date,
        default: Date.now
      },
      instruction: {
        type: String
      },
      instructionType: {
        type: String,
        enum: ["Initial", "Proof", "Revision", "QC", "Misc"]
      },
      user: {
        type: String
      }
    }
  ],
  currentArtist: {
    type: String
  },
  uploadDate: {
    type: Date,
    default: null
  },
  sentVendor: {
    type: Date,
    default: null
  },
  qty: {
    type: Number
  },
  netValue: {
    type: Number
  },
  currency: {
    type: String,
    enum: ["CAD", "USA"]
  },
  latestShipDate: {
    type: Date,
    default: null
  },
  markEvent: {
    type: String
  },
  mutishipPrePack: {
    type: String
  },
  vendorConfirmShip: {
    type: Date,
    default: null
  },
  shipStatus: {
    type: String
  },
  estDeliveryDate: {
    type: Date,
    default: null
  },
  tracking: [
    {
      type: String
    }
  ],
  confirmDeliveryDate: {
    type: Date,
    default: null
  },
  confirmDeliveryStatus: {
    type: String
  },
  shippingNotes: {
    type: String
  },
  prodLeadTime: {
    type: Number
  },
  shippingLeadTime: {
    type: Number
  },
  totalLeadTime: {
    type: Number
  }
});

module.exports = mongoose.model("orders", OrderSchema);
