const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Proof Schema
const ProofSchema = new Schema({
	orderNum: {
		type: String,
		required: true
	},
	client: {
		type: String,
		required: true
	},
	isr: {
		type: String,
		required: true,
		uppercase: true
	},
	itemNumber: {
		type: String,
		required: true
	},
	styleNumber: {
		type: String,
		required: true,
		uppercase: true
	},
	styleName: {
		type: String,
		required: true
	},
	gender: {
		type: String,
		required: true
	},
	sizes: {
		type: String,
		required: true,
		uppercase: true
	},
	fabric: {
		type: String,
		required: true
	},
	fit: {
		type: String,
		required: true
	},
	zap: {
		type: String
	},
	chamois: {
		type: String
	},
	features: {
		type: String
	},
	brand: {
		type: String,
		required: true
	},
	artist: {
		type: String,
		uppercase: true
	},
	soRef: {
		type: String
	},
	cwoRef: {
		type: String
	},
	prfDate: {
		type: Date,
		required: true
	},
	thread: {
		type: String,
		uppercase: true
	},
	zipper: {
		type: String,
		uppercase: true
	},
	contrast: {
		type: String,
		uppercase: true
	},
	colors: [
		{
			colorname: {
				type: String
			},
			colorr: {
				type: String
			},
			colorg: {
				type: String
			},
			colorb: {
				type: String
			}
		}
	],
	viewImgLink: {
		type: String,
		required: true
	},
	pdfLink: {
		type: String
	},
	proofOBJLink: {
		type: String
	},
	proofMTLLink: {
		type: String
	},
	hasQCNote: {
		type: Boolean,
		default: false
	},
	qcnote: {
		noteDate: {
			type: Date
		},
		note: {
			type: String
		},
		noteUser: {
			type: String,
			uppercase: true
		}
	},
	qcnotearchive: [
		{
			noteDate: {
				type: Date
			},
			note: {
				type: String
			},
			noteUser: {
				type: String,
				uppercase: true
			}
		}
	]
});

module.exports = mongoose.model('proofs', ProofSchema);
