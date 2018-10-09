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
      "5. Proof Complete",
      "6. Waiting for Revision",
      "7. Revision - Waiting on Someone else",
      "8. Revision Started",
      "9. Revision Ready for QC",
      "10. Revision Complete",
      "11. Waiting for Output",
      "12. Output - Waiting on Someone else",
      "13. Output Started",
      "14. Output Ready for QC",
      "15. Waiting for PNT",
      "16. PNT Ready for QC",
      "17. Uploaded",
      "18. Sent to Vendor",
      "19. CANCELLED"
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
      }
    }
  ],
  currentArtist: {
    type: String
  },
  currentQC: {
    type: String
  },
  emailSent: {
    type: Date,
    default: null
  },
  uploadDate: {
    type: Date,
    default: null
  },
  sentVendor: {
    type: Date,
    default: null
  },
  artNotes: [
    {
      date: {
        type: Date
      },
      note: {
        type: String
      }
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
