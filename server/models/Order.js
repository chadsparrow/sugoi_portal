const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");

// Create Order Schema
const OrderSchema = new Schema({
  orderNum: {
    type: String,
    required: true
  },
  accountNum: {
    type: String
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
    default: "A. Waiting for Proof"
  },
  priority: {
    type: String,
    enum: ["", "VIP", "RUSH"]
  },
  enteredDate: {
    type: Date,
    default: moment()
      .utc()
      .format()
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
    uppercase: true
  },
  client: {
    type: String
  },
  instructions: [
    {
      date: {
        type: Date,
        default: moment()
          .utc()
          .format()
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
    type: String
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
  invoiceSent: {
    type: Date
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
  proofRequestDate: {
    type: Date
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
  checkpoints: [],
  revisionRequestDate: {
    type: Date
  },
  revisionCompletionDate: {
    type: Date
  },
  orderNotes: {
    type: String
  },
  accountName: {
    type: String
  },
  contactName: {
    type: String
  },
  shipToName: {
    type: String
  },
  shipToAddress: {
    type: String
  },
  shipToCity: {
    type: String
  },
  shipToProvState: {
    type: String
  },
  shipToCountry: {
    type: String
  },
  shipToPostalZip: {
    type: String
  },
  contactPhone: {
    type: String
  },
  contactEmail: {
    type: String
  },
  orderDiscount: {
    type: Number
  },
  multiShips: {
    type: Number
  },
  prePacks: {
    type: Number
  },
  deposit: {
    type: Number
  },
  orderLines: [
    {
      lineNumber: {
        type: String
      },
      lineJobType: {
        type: String
      },
      swoReference: {
        type: String
      },
      priceBreak: {
        type: Number
      },
      graphicCode: {
        type: String
      },
      qdCode: {
        type: String
      },
      colour1: {
        type: String
      },
      colour2: {
        type: String
      },
      colour3: {
        type: String
      },
      tracingCharge: {
        type: Number
      },
      creativeCharge: {
        type: Number
      },
      scaledArtCharge: {
        type: Number
      },
      itemsSubTotal: {
        type: Number
      },
      items: [
        {
          itemNumber: {
            type: String
          },
          childReference: {
            type: String
          },
          description: {
            type: String
          },
          jbaCode: {
            type: String
          },
          styleCode: {
            type: String
          },
          autobahnCode: {
            type: String
          },
          inkType: {
            type: String
          },
          zipper: {
            type: String
          },
          thread: {
            type: String
          },
          contrast: {
            type: String
          },
          personalization: {
            type: Boolean
          },
          zap: {
            type: Boolean
          },
          sizeRange: {
            type: String
          },
          xxs: {
            type: Number
          },
          xs: {
            type: Number
          },
          s: {
            type: Number
          },
          m: {
            type: Number
          },
          l: {
            type: Number
          },
          xl: {
            type: Number
          },
          xxl: {
            type: Number
          },
          xxxl: {
            type: Number
          },
          totalUnits: {
            type: Number
          },
          unitPrice: {
            type: Number
          },
          addOns: {
            type: Number
          },
          itemDiscount: {
            type: Number
          },
          finalUnitPrice: {
            type: Number
          },
          itemTotalPrice: {
            type: Number
          }
        }
      ]
    }
  ]
});

module.exports = mongoose.model("orders", OrderSchema);
