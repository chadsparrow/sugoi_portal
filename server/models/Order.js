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
      "1. Waiting for Proof",
      "2. Proof Started",
      "3. Proof - Waiting on Someone else",
      "4. Proof Ready for QC",
      "5. Proof QC Complete",
      "6. Proof Complete",
      "7. Waiting for Revision",
      "8. Revision - Waiting on Someone else",
      "9. Revision Started",
      "10. Revision Ready for QC",
      "11. Revision QC Complete",
      "12. Revision Complete",
      "13. Waiting for Output",
      "14. Output - Waiting on Someone else",
      "15. Output Started",
      "16. Output Ready for QC",
      "17. Output QC Complete",
      "18. Waiting for PNT",
      "19. PNT Ready for QC",
      "20. PNT QC Complete",
      "21. Uploaded",
      "22. Sent to Vendor",
      "23. CANCELLED"
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
