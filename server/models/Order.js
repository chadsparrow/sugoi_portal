const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');

// Create Order Schema
const OrderSchema = new Schema({
  orderNum: {
    type: String,
    required: true
  },
  accountNum: {
    type: String,
    default: null,
    uppercase: true
  },
  currentStatus: {
    type: String,
    default: "A. Waiting for Proof"
  },
  priority: {
    type: String,
    uppercase: true
  },
  enteredDate: {
    type: Date,
    default: () => { return new Date() }
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
    uppercase: true,
    default: null
  },
  client: {
    type: String,
    default: null
  },
  instructions: [
    {
      date: {
        type: Date,
        default: () => { return new Date() }
      },
      instruction: {
        type: String,
        trim: true,
        default: null
      },
      instructionType: {
        type: String,
      },
      user: {
        type: String,
        uppercase: true,
        default: null
      }
    }
  ],
  currentArtist: {
    type: String,
    uppercase: true,
    default: null
  },
  uploadDate: {
    type: Date,
    default: null
  },
  vendor: {
    type: String,
    uppercase: true,
  },
  sentVendor: {
    type: Date,
    default: null
  },
  qty: {
    type: Number,
    default: null
  },
  netValue: {
    type: Number,
    default: null
  },
  currency: {
    type: String,
    uppercase: true
  },
  latestShipDate: {
    type: Date,
    default: null
  },
  markEvent: {
    type: String,
    default: null
  },
  vendorConfirmShip: {
    type: Date,
    default: null
  },
  multishipPrePack: {
    type: String,
    default: null
  },
  shipStatus: {
    type: String,
    default: null
  },
  estDeliveryDate: {
    type: Date,
    default: null
  },
  tracking: {
    type: String,
    default: null,
    uppercase: true
  },
  confirmDeliveryDate: {
    type: Date,
    default: null
  },
  confirmDeliveryStatus: {
    type: String,
    default: null
  },
  jbaPONum: {
    type: String,
    default: null,
    uppercase: true
  },
  jbaGNRNum: {
    type: String,
    default: null,
    uppercase: true
  },
  jbaInvoiceNum: {
    type: String,
    default: null,
    uppercase: true
  },
  invoiceSent: {
    type: Date,
    default: null
  },
  shippingNotes: {
    type: String,
    default: null
  },
  prodLeadTime: {
    type: Number,
    default: null
  },
  shippingLeadTime: {
    type: Number,
    default: null
  },
  totalLeadTime: {
    type: Number,
    default: null
  },
  approvedTerms: {
    type: String,
    default: null
  },
  onTermPayment: {
    type: Number,
    default: null
  },
  kitOrderPayment: {
    type: Number,
    default: null
  },
  isrCollectedOrig: {
    type: Number,
    default: null
  },
  isrCollectedCAD: {
    type: Number,
    default: null
  },
  isrRefunded: {
    type: Number,
    default: null
  },
  isrPaymentDate: {
    type: Date,
    default: null
  },
  isrPaymentType: {
    type: String,
    default: null
  },
  paymentNotes: {
    type: String,
    default: null
  },
  balanceOutstanding: {
    type: Number,
    default: null
  },
  paymentStatus: {
    type: String,
    default: null
  },
  proofRequestDate: {
    type: Date,
    default: null
  },
  proofCompletionDate: {
    type: Date,
    default: null
  },
  signedOffDate: {
    type: Date,
    default: null
  },
  proofTurnaround: {
    type: Number,
    default: null
  },
  outputTurnaround: {
    type: Number,
    default: null
  },
  checkpoints: [],
  revisionRequestDate: {
    type: Date,
    default: null
  },
  revisionCompletionDate: {
    type: Date,
    default: null
  },
  orderNotes: {
    type: String,
    default: null
  },
  contactName: {
    type: String,
    default: null
  },
  shipToName: {
    type: String,
    default: null
  },
  shipToAddress: {
    type: String,
    default: null
  },
  shipToCity: {
    type: String,
    default: null
  },
  shipToProvState: {
    type: String,
    default: null,
    uppercase: true
  },
  shipToCountry: {
    type: String,
    default: null,
    uppercase: true
  },
  shipToPostalZip: {
    type: String,
    default: null,
    uppercase: true
  },
  contactPhone: {
    type: String,
    default: null
  },
  contactEmail: {
    type: String,
    default: null
  },
  multiShips: {
    type: Number,
    default: null
  },
  prePacks: {
    type: Number,
    default: null
  },
  deposit: {
    type: Number,
    default: null
  },
  taxes: {
    type: Number,
    default: null
  },
  orderDiscount: {
    type: Number,
    default: null
  },
  orderLines: [
    {
      lineNumber: {
        type: String,
        default: null
      },
      lineJobType: {
        type: String,
        default: null,
        uppercase: true
      },
      swoReference: {
        type: String,
        default: null
      },
      priceBreak: {
        type: Number,
        default: null
      },
      graphicCode: {
        type: String,
        default: null,
        uppercase: true
      },
      graphicColours: {
        type: Number,
        default: null
      },
      colourWayCode: {
        type: String,
        default: null,
        uppercase: true
      },
      colour1: {
        type: String,
        default: null,
        uppercase: true
      },
      colour2: {
        type: String,
        default: null,
        uppercase: true
      },
      colour3: {
        type: String,
        default: null,
        uppercase: true
      },
      tracingCharge: {
        type: Number,
        default: null
      },
      creativeCharge: {
        type: Number,
        default: null
      },
      scaledArtCharge: {
        type: Number,
        default: null
      },
      itemsSubTotal: {
        type: Number,
        default: null
      },
      cancelled: {
        type: Boolean,
        default: false
      },
      items: [
        {
          itemNumber: {
            type: String,
            default: null
          },
          childReference: {
            type: String,
            default: null
          },
          selectedStyle: {
            type: String,
            default: null
          },
          selectedConfig: {
            type: String,
            default: null
          },
          jbaCode: {
            type: String,
            default: null,
            uppercase: true
          },
          styleCode: {
            type: String,
            default: null,
            uppercase: true
          },
          autobahnCode: {
            type: String,
            default: null,
            uppercase: true
          },
          inkType: {
            type: String,
            default: null
          },
          zipper: {
            type: String,
            default: null,
            uppercase: true
          },
          thread: {
            type: String,
            default: null,
            uppercase: true
          },
          contrast: {
            type: String,
            default: null,
            uppercase: true
          },
          personalization: {
            type: Boolean,
            default: false
          },
          zap: {
            type: Boolean,
            default: false
          },
          sizeRange: {
            type: String,
            default: null,
            uppercase: true
          },
          xxs: {
            type: Number,
            default: null
          },
          xs: {
            type: Number,
            default: null
          },
          s: {
            type: Number,
            default: null
          },
          m: {
            type: Number,
            default: null
          },
          l: {
            type: Number,
            default: null
          },
          xl: {
            type: Number,
            default: null
          },
          xxl: {
            type: Number,
            default: null
          },
          xxxl: {
            type: Number,
            default: null
          },
          totalUnits: {
            type: Number,
            default: null
          },
          unitPrice: {
            type: Number,
            default: null
          },
          addOns: {
            type: Number,
            default: null
          },
          itemDiscount: {
            type: Number,
            default: null
          },
          finalUnitPrice: {
            type: Number,
            default: null
          },
          itemTotalPrice: {
            type: Number,
            default: null
          },
          cancelled: {
            type: Boolean,
            default: false
          }
        }
      ]
    }
  ]
});

OrderSchema.plugin(timestamps);

module.exports = mongoose.model("orders", OrderSchema);
