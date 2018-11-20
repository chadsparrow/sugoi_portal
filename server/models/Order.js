const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Order Schema
const OrderSchema = new Schema({
  orderNum: {
    type: String,
    required: true
  },
  accountNum: {
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
    required: true,
    uppercase: true
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
        type: String,
        trim: true
      },
      instructionType: {
        type: String,
        enum: ["Initial", "Revision", "Note", "System"]
      },
      user: {
        type: String,
        uppercase: true
      }
    }
  ],
  currentArtist: {
    type: String,
    uppercase: true
  },
  uploadDate: {
    type: Date,
    default: null
  },
  vendor: {
    type: String,
    required: true
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
    enum: ["", "CAD", "USD"]
  },
  latestShipDate: {
    type: Date,
    default: null
  },
  markEvent: {
    type: String
  },
  multishipPrePack: {
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
  tracking: {
    type: String
  },
  confirmDeliveryDate: {
    type: Date,
    default: null
  },
  confirmDeliveryStatus: {
    type: String
  },
  jbaPONum: {
    type: String
  },
  jbaGNRNum: {
    type: String
  },
  jbaInvoiceNum: {
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
  },
  approvedTerms: {
    type: String
  },
  onTermPayment: {
    type: Number
  },
  kitOrderPayment: {
    type: Number
  },
  isrCollectedOrig: {
    type: Number
  },
  isrCollectedCAD: {
    type: Number
  },
  isrRefunded: {
    type: Number
  },
  isrPaymentDate: {
    type: Date
  },
  isrPaymentType: {
    type: String
  },
  paymentNotes: {
    type: String
  },
  balanceOutstanding: {
    type: Number
  },
  paymentStatus: {
    type: String
  },
  proofCompletionDate: {
    type: Date
  },
  signedOffDate: {
    type: Date
  },
  proofTurnaround: {
    type: Number
  },
  outputTurnaround: {
    type: Number
  },
  checkpoints: []
});

module.exports = mongoose.model("orders", OrderSchema);
