const logger = require('../helpers/logs');
const dayjs = require('dayjs');
const Proof = require('../models/Proof');
const Order = require('../models/Order');

// @desc    Get proof page
// @route   GET /proofs/:id
// @access  Private
exports.getProofPage = async (req, res, next) => {
	try {
		const foundProof = await Proof.findById(req.params.id);
		const mainOrder = await Order.findOne({ orderNum: foundProof.orderNum });

		res.render('proofs/view', { foundProof, mainOrder });
	} catch (err) {
		logger.error(err);
	}
};

// @desc    Get QC Page for Proof
// @route   GET /proofs/qc/:orderNum
// @access  Private - Edit Proofs role
exports.getQCPage = async (req, res, next) => {
	try {
		const foundProofs = await Proof.find({ orderNum: req.params.orderNum });
		const mainOrder = await Order.findOne({ orderNum: req.params.orderNum });

		res.render('proofs/qc', { foundProofs, mainOrder });
	} catch (err) {
		logger.error(err);
	}
};

// @desc    Get QC Edit Page for Proof
// @route   GET /proofs/qc/edit/:id
// @access  Private - Edit Proofs role
exports.getQCEditPage = async (req, res, next) => {
	try {
		const foundProof = await Proof.findById(req.params.id);
		res.render('proofs/qc-edit', { foundProof });
	} catch (err) {
		logger.error(err);
	}
};

// @desc    Update QC
// @route   PUT /proofs/qc/edit/:id
// @access  Private - Edit Proofs role
exports.updateQC = async (req, res, next) => {
	try {
		const id = req.params.id;
		const { note, noteUser } = req.body;
		const hasQCNote = true;
		const qcnote = {
			noteDate: dayjs().format(),
			noteUser,
			note
		};

		const updatedProof = await Proof.updateOne(
			{ _id: id },
			{ hasQCNote: hasQCNote, qcnote: qcnote },
			{ new: true, upsert: true }
		);
		req.flash('success_msg', 'Proof QC Updated');
		res.redirect(`/proofs/qc/${updatedProof.orderNum}`);
	} catch (err) {
		logger.err(err);
	}
};

// @desc    Archive a QC Note
// @route   GET /proofs/qc/archive/:id
// @access  Private - Edit Proofs role
exports.archiveQCNote = async (req, res, next) => {
	try {
		const id = req.params.id;
		let foundProof = await Proof.findById(id);
		const qcnote = foundProof.qcnote;
		foundProof.qcnotearchive.push(qcnote);
		foundProof.qcnote = {
			noteDate: null,
			noteUser: null,
			note: null
		};

		const updatedProof = await foundProof.save();
		req.flash('success_msg', 'Proof QC Archived');
		res.redirect(`/proofs/qc/${updatedProof.orderNum}`);
	} catch (err) {
		logger.error(err);
	}
};

// @desc    View QC Archive for single order
// @route   GET /proofs/qc/archive/view/:orderNum
// @access  Private - Edit Proofs role
exports.viewQCArchives = async (req, res, next) => {
	try {
		const orderNum = req.params.orderNum;
		const foundProofs = await Proof.find({ orderNum: orderNum });

		res.render('proofs/qc-archive', { foundProofs, orderNum });
	} catch (err) {
		logger.error(err);
	}
};
