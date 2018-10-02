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
      "Waiting for Proof",
      "Proof Started",
      "Proof - Waiting on Someone else",
      "Proof Ready for QC",
      "Proof Complete",
      "Waiting for Revision",
      "Revision - Waiting on Someone else",
      "Revision Started",
      "Revision Ready for QC",
      "Revision Complete",
      "Waiting for Output",
      "Output - Waiting on Someone else",
      "Output Started",
      "Output Ready for QC",
      "Waiting for PNT",
      "PNT Ready for QC",
      "Uploaded",
      "CANCELLED"
    ],
    required: true
  },
  priority: {
    type: String,
    enum: ["", "VIP", "RUSH"]
  },
  requestDate: {
    type: Date,
    required: true
  },
  eventDate: {
    type: Date
  },
  lastestInHand: {
    type: Date
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
      date: Date,
      instruction: String
    }
  ],
  proofs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proof"
    }
  ],
  currentArtist: {
    type: String
  },
  currentQC: {
    type: String
  },
  emailSent: {
    type: Date
  },
  uploadDate: {
    type: Date
  },
  sentVendor: {
    type: Date
  },
  artNotes: [
    {
      date: Date,
      note: String
    }
  ],
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
    type: Date
  },
  markEvent: {
    type: String
  },
  mutishipPrePack: {
    type: String
  },
  vendorConfirmShip: {
    type: Date
  },
  shipStatus: {
    type: String
  },
  estDeliveryDate: {
    type: Date
  },
  tracking: {
    type: String
  },
  confirmDeliveryDate: {
    type: Date
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
