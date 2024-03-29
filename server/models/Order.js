const mongoose = require('mongoose');
const Float = require('mongoose-float').loadType(mongoose, 2);
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');

// Create Order Schema
const OrderSchema = new Schema({
	orderNum: {
		type: String,
		required: true,
		uppercase: true,
		trim: true
	},
	accountNum: {
		type: String,
		default: null,
		uppercase: true,
		trim: true
	},
	quoteToggle: {
		type: Boolean,
		default: true
	},
	currentStatus: {
		type: String,
		default: '1. Initial'
	},
	priority: {
		type: String,
		uppercase: true
	},
	enteredDate: {
		type: Date,
		default: () => {
			return new Date();
		}
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
	outRep: {
		type: String,
		default: null,
		trim: true
	},
	client: {
		type: String,
		default: null,
		trim: true
	},
	instructions: [
		{
			date: {
				type: Date,
				default: () => {
					return new Date();
				}
			},
			instruction: {
				type: String,
				trim: true,
				default: null
			},
			instructionType: {
				type: String
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
		default: 'CCN'
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
		type: Float,
		default: null
	},
	estValue: {
		type: Number,
		default: null
	},
	currency: {
		type: String,
		uppercase: true,
		default: 'USD'
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
		uppercase: true,
		trim: true
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
		uppercase: true,
		trim: true
	},
	jbaGNRNum: {
		type: String,
		default: null,
		trim: true
	},
	jbaInvoiceNum: {
		type: String,
		default: null,
		trim: true
	},
	jbaInvoiceDate: {
		type: Date,
		default: null
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
	isrRefundedDate: {
		type: Date,
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
	paymentNotesDate: {
		type: Date
	},
	paymentNotesLog: [
		{
			note: {
				type: String
			},
			date: {
				type: Date
			}
		}
	],
	balanceOutstanding: {
		type: Float,
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
		default: null,
		trim: true
	},
	customerNotes: {
		type: String,
		default: null,
		trim: true
	},
	customerPO: {
		type: String,
		default: null,
		trim: true
	},
	contactName: {
		type: String,
		default: null,
		trim: true
	},
	shipToName: {
		type: String,
		default: null,
		trim: true
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
	priorityShipping: {
		type: Number,
		default: null
	},
	revisionCharge: {
		type: Number,
		default: null
	},
	deposit: {
		type: Number,
		default: null
	},
	beforeTaxes: {
		type: Number,
		default: null
	},
	taxAmount: {
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
	need3d: {
		type: Boolean,
		default: false
	},
	needSketch: {
		type: Boolean,
		default: false
	},
	lgOrder: {
		type: Boolean,
		default: false
	},
	use2020Pricing: {
		type: Boolean
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
				default: 'CUSTM',
				uppercase: true
			},
			graphicColours: {
				type: Number,
				default: null
			},
			colourWayCode: {
				type: String,
				default: 'SUB',
				uppercase: true
			},
			tracingCharge: {
				type: Number,
				default: null
			},
			colourWashCharge: {
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
			totalAddOns: {
				type: Number,
				default: null
			},
			lineItemsQty: {
				type: Number,
				default: null
			},
			useLGPricing: {
				type: Boolean,
				default: false
			},
			items: [
				{
					itemNumber: {
						type: String,
						default: null
					},
					brand: {
						type: String,
						default: null
					},
					childReference: {
						type: String,
						default: null
					},
					extendedDescription: {
						type: String,
						default: null
					},
					selectedStyle: {
						type: Number,
						default: -1
					},
					selectedConfig: {
						type: Number,
						default: -1
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
						default: 'D',
						uppercase: true
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
					one: {
						type: Number,
						default: 0
					},
					xxs: {
						type: Number,
						default: 0
					},
					xs: {
						type: Number,
						default: 0
					},
					s: {
						type: Number,
						default: 0
					},
					m: {
						type: Number,
						default: 0
					},
					l: {
						type: Number,
						default: 0
					},
					xl: {
						type: Number,
						default: 0
					},
					xxl: {
						type: Number,
						default: 0
					},
					xxxl: {
						type: Number,
						default: 0
					},
					totalUnits: {
						type: Number,
						default: 0
					},
					unitPrice: {
						type: Number,
						default: 0
					},
					unitCost: {
						type: Number,
						default: 0
					},
					usdTariff: {
						type: String,
						default: null
					},
					cadTariff: {
						type: String,
						default: null
					},
					addOns: {
						type: Number,
						default: 0
					},
					itemDiscount: {
						type: Number,
						default: 0
					},
					itemDiscountType: {
						type: String,
						enum: ['%', '$'],
						default: '%'
					},
					finalUnitPrice: {
						type: Number,
						default: 0
					},
					itemTotalPrice: {
						type: Number,
						default: 0
					},
					cancelled: {
						type: Boolean,
						default: false
					},
					configs: [],
					contrastOptions: [],
					zipperOptions: [],
					colour1: {
						type: String,
						default: ''
					},
					colour2: {
						type: String,
						default: ''
					},
					colour3: {
						type: String,
						default: ''
					},
					gender: {
						type: String
					},
					fabric: {
						type: String
					},
					sketchOnly: {
						type: Boolean,
						default: false
					},
					itemNote: {
						type: String,
						default: null
					}
				}
			]
		}
	]
});

OrderSchema.plugin(timestamps);

module.exports = mongoose.model('orders', OrderSchema);
