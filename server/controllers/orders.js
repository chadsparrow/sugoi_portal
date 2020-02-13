const logger = require('../helpers/logs');
const dayjs = require('dayjs');
const jsonxml = require('jsontoxml');
const DateDiff = require('date-diff');
const moment = require('moment-timezone');

const Order = require('../models/Order');
const Report = require('../models/Report');
const CustomArtist = require('../models/CustomArtist');
const CustomRep = require('../models/CustomRep');

// FUNCTIONS
// @desc    Gets the week number of current week
Date.prototype.getWeek = function() {
	var date = new Date(this.getTime());
	date.setHours(0, 0, 0, 0);
	// Thursday in current week decides the year.
	date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
	// January 4 is always in week 1.
	var week1 = new Date(date.getFullYear(), 0, 4);
	// Adjust to Thursday in week 1 and count number of weeks from date to week1.
	return (
		1 +
		Math.round(
			((date.getTime() - week1.getTime()) / 86400000 -
				3 +
				((week1.getDay() + 6) % 7)) /
				7
		)
	);
};

// @desc- GETS DATE RANGE FOR CURRENT WEEK
function getDateRangeOfWeek(weekNo, y) {
	var d1, numOfdaysPastSinceLastMonday, rangeIsFrom, rangeIsTo;
	var months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];
	d1 = new Date('' + y + '');
	numOfdaysPastSinceLastMonday = d1.getDay() - 1;
	d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
	d1.setDate(d1.getDate() + 7 * (weekNo - d1.getWeek()));
	rangeIsFrom =
		months[d1.getMonth()] + '-' + d1.getDate() + '-' + d1.getFullYear();
	d1.setDate(d1.getDate() + 6);
	rangeIsTo =
		months[d1.getMonth()] + '-' + d1.getDate() + '-' + d1.getFullYear();
	return rangeIsFrom + ' to ' + rangeIsTo;
}

module.exports = {
	// @desc    Get PO for single order
	// @route   GET /orders/po/:orderNum
	// @access  Private
	showOrderPO: async (req, res, next) => {
		try {
			let pageTitle = `${req.params.orderNum} PO`;
			let poDate = dayjs().format('MM/DD/YYYY');
			let items = [];

			const order = await Order.findOne({ orderNum: req.params.orderNum });
			const vendor = order.vendor;

			for (let orderLine of order.orderLines) {
				if (!orderLine.cancelled) {
					for (let item of orderLine.items) {
						if (!item.cancelled) {
							if (vendor === 'PNR') {
								item.unitCost = 0;
							}

							if (item.personalization === true) {
								item.unitCost += 5.0;
							}

							items.push(item);
						}
					}
				}
			}

			res.render('orders/po', {
				order,
				pageTitle,
				poDate,
				items
			});
		} catch (err) {
			logger.error(err);
		}
	},

	// @desc    Get XML for single order
	// @route   GET /orders/xml/:orderNum
	// @access  Private
	showOrderXML: async (req, res, next) => {
		try {
			let order = await Order.findOne({ orderNum: req.params.orderNum });
			const newOrderObject = {};
			newOrderObject.SAP = [];
			if (order.client) {
				order.client = order.client.replace(/&/g, '&amp;');
				order.client = order.client.replace(/</g, '&lt;');
				order.client = order.client.replace(/>/g, '&gt;');
				order.client = order.client.replace(/"/g, '&quot;');
				order.client = order.client.replace(/'/g, '&apos;');
			}

			for (let orderLine of order.orderLines) {
				if (!orderLine.cancelled) {
					if (orderLine.items.length > 0) {
						for (let item of orderLine.items) {
							if (!item.cancelled) {
								if (
									order.needSketch === false ||
									(order.needSketch === true && item.sketchOnly === true)
								) {
									let prs = '';
									if (item.personalization) {
										prs = 'Y';
									} else {
										prs = 'N';
									}
									let scaled = '';
									if (orderLine.scaledArtCharge > 0) {
										scaled = 'Y';
									} else {
										scaled = 'N';
									}

									let extendedDescription = item.extendedDescription;
									extendedDescription = extendedDescription.replace(
										/&/g,
										'&amp;'
									);
									extendedDescription = extendedDescription.replace(
										/</g,
										'&lt;'
									);
									extendedDescription = extendedDescription.replace(
										/>/g,
										'&gt;'
									);
									extendedDescription = extendedDescription.replace(
										/"/g,
										'&quot;'
									);
									extendedDescription = extendedDescription.replace(
										/'/g,
										'&apos;'
									);

									newOrderObject.SAP.push({
										item: {
											SALESORDER: order.orderNum,
											CLIENT: order.client,
											CHILDWORKORDER: item.itemNumber,
											STYLENUM: item.autobahnCode,
											STYLENAME: extendedDescription,
											PARENTWORKORDER: orderLine.lineNumber,
											XXS: item.xxs,
											XS: item.xs,
											S: item.s,
											M: item.m,
											L: item.l,
											XL: item.xl,
											XXL: item.xxl,
											XXXL: item.xxxl,
											ONE: item.one,
											PROOFARTIST: order.currentArtist,
											OUTPUTARTIST: '.',
											SHIPTO: order.accountNum,
											TAKENBY: order.isr,
											JOBTYPE: orderLine.lineJobType,
											REFERENCEORDER: orderLine.swoReference,
											CHILDREFERENCEORDER: item.childReference,
											COLORS1: item.colour1,
											COLORS2: item.colour2,
											COLORS3: item.colour3,
											COLORS4: '.',
											COLORS5: '.',
											COLORS6: '.',
											ZIPPERCOLOR: item.zipper,
											CONTRASTCOLOR: item.contrast,
											THREADCOLOR: item.thread,
											GRAPHIC: orderLine.graphicCode,
											COLOURWAY: orderLine.colourWayCode,
											CUSTOMERPO: '.',
											REVISION: '.',
											BRAND: item.brand,
											FACTORY: order.vendor,
											SCALED_ART: scaled,
											PERSONALIZATION: prs,
											INK: item.inkType,
											SCALEDSIZES: '.'
										}
									});
								}
							}
						}
					}
				}
			}
			const xml = jsonxml(newOrderObject);
			res.type('application/xml').send(xml);
		} catch (err) {
			logger.error(err);
		}
	},

	// @desc    Get all orders
	// @route   GET /orders/all
	// @access  private
	getAllOrders: async (req, res, next) => {
		try {
			let pageTitle = 'All';
			let orders;
			if (req.user.lgUser) {
				pageTitle = 'LG All';
				orders = await Order.find({ lgOrder: true });
			} else {
				orders = await Order.find();
			}
			res.render('orders/index', { orders, pageTitle });
		} catch (err) {
			logger.error(err);
		}
	},

	// @desc    Get all "In Progress" Orders (PRE-PROD)
	// @route   GET /orders
	// @access  Private
	getInProgressOrders: async (req, res, next) => {
		try {
			let pageTitle = 'In Progress';
			let orders;
			if (req.user.lgUser) {
				pageTitle = 'LG In Progress';
				orders = await Order.find({
					currentStatus: {
						$not: {
							$in: [
								'V. Sent to Vendor',
								'W. CANCELLED',
								'1. Initial',
								'X. Archived'
							]
						}
					},
					lgOrder: true
				});
			} else {
				orders = await Order.find({
					currentStatus: {
						$not: {
							$in: [
								'V. Sent to Vendor',
								'W. CANCELLED',
								'1. Initial',
								'X. Archived'
							]
						}
					}
				});
			}
			res.render('orders/index', { orders, pageTitle });
		} catch (err) {
			logger.error(err);
		}
	},

	// @desc    Get all "Initial" Orders (PRE-PROD)
	// @route   GET /orders/initial
	// @access  Private
	getInitialOrders: async (req, res, next) => {
		try {
			let pageTitle = 'Initial';
			let orders;
			if (req.user.lgUser) {
				pageTitle = 'LG Initial';
				orders = await Order.find({
					currentStatus: '1. Initial',
					lgOrder: true
				});
			} else {
				orders = await Order.find({ currentStatus: '1. Initial' });
			}
			res.render('orders/index', { orders, pageTitle });
		} catch (err) {
			logger.error(err);
		}
	},

	// @desc    Get all "Completed" Orders (PRE-PROD)
	// @route   GET /orders/completed
	// @access  Private
	getCompletedOrders: async (req, res, next) => {
		try {
			let pageTitle = 'Completed';
			let orders;
			if (req.user.lgUser) {
				pageTitle = 'LG Completed';
				orders = await Order.find({
					currentStatus: 'V. Sent to Vendor',
					lgOrder: true
				});
			} else {
				orders = await Order.find({ currentStatus: 'V. Sent to Vendor' });
			}
			res.render('orders/notinprogress', { orders, pageTitle });
		} catch (err) {
			logger.error(err);
		}
	},

	// @desc    Get all "Cancelled" Orders (PRE-PROD)
	// @route   GET /orders/cancelled
	// @access  Private
	getCancelledOrders: async (req, res, next) => {
		try {
			let pageTitle = 'Cancelled';
			let orders;
			if (req.user.lgUser) {
				pageTitle = 'LG Cancelled';
				orders = await Order.find({
					currentStatus: 'W. CANCELLED',
					lgOrder: true
				});
			} else {
				orders = await Order.find({ currentStatus: 'W. CANCELLED' });
			}
			res.render('orders/notinprogress', { orders, pageTitle });
		} catch (err) {
			logger.error(err);
		}
	},

	// @desc    Get all "Archived" Orders (PRE-PROD)
	// @route   GET /orders/archived
	// @access  Private
	getArchivedOrders: async (req, res, next) => {
		try {
			let pageTitle = 'Archived';
			let orders;
			if (req.user.lgUser) {
				pageTitle = 'LG Archived';
				orders = await Order.find({
					currentStatus: 'X. Archived',
					lgOrder: true
				});
			} else {
				orders = await Order.find({ currentStatus: 'X. Archived' });
			}
			res.render('orders/index', { orders, pageTitle });
		} catch (err) {
			logger.error(err);
		}
	},

	// @desc    Displays "add new order" page
	// @route   GET /orders/add
	// @access  Private
	getAddOrderPage: async (req, res, next) => {
		const currentUser = req.user.username.toUpperCase();
		const order = await Order.findOne({
			orderNum: { $regex: /^\d+$/ }
		}).sort('-orderNum');
		const newOrderNum = req.user.lgUser
			? '9LG_'
			: (parseInt(order.orderNum) + 1).toString();
		const office = req.user.lgUser ? 'LG' : 'SUGOI';
		try {
			const customReps = await CustomRep.find({ office: office }).sort('text');
			res.render('orders/add', {
				orderNum: newOrderNum,
				priority: '',
				currentStatus: '',
				isr: '',
				instruction: '',
				vendor: '',
				estValue: 0,
				lgOrder: req.user.lgUser,
				customReps: customReps,
				currentUser: currentUser
			});
		} catch (err) {
			logger.error(err);
		}
	},

	// @desc    Add a new order to database
	// @route   POST /orders/add
	// @access  Private - Edit Orders Role
	addOrder: async (req, res, next) => {
		try {
			let {
				orderNum,
				priority,
				isr,
				instruction,
				vendor,
				estValue,
				currency
			} = req.body;
			isr = isr.toUpperCase();

			let instructions = [];

			if (instruction) {
				instructions.push({
					instruction,
					instructionType: 'Initial',
					user: isr
				});
			}

			const quoteToggle = req.user.lgUser ? false : true;

			let order = await Order.findOne({ orderNum: orderNum });
			if (order) {
				req.flash('error_msg', 'Order Number already entered');
				res.redirect('/orders/add');
				return;
			}

			const newOrder = await Order.create({
				orderNum,
				priority,
				isr,
				instructions,
				vendor,
				estValue,
				currency,
				lgOrder: req.user.lgUser,
				quoteToggle,
				use2020Pricing: true
			});

			logger.info(
				`${newOrder.orderNum} added to the database by ${req.user.username}`
			);
			req.flash('success_msg', 'Order Added');
			res.redirect('/orders/initial');
		} catch (err) {
			logger.error(err);
		}
	},

	// @desc    View a single order page
	// @route   GET /orders/view/:id
	// @access  Public
	viewOrderPage: async (req, res, next) => {
		try {
			const order = await Order.findById(req.params.id);
			const office = order.lgOrder ? 'LG' : 'SUGOI';
			const customReps = await CustomRep.find({ office: office }).sort('text');

			res.render('orders/view', { order, customReps });
		} catch (err) {
			logger.error(err);
		}
	},

	// @desc    Get Edit page for a single order page
	// @route   GET /orders/edit/:id
	// @access  Private - Edit Orders Role
	getEditOrderPage: async (req, res, next) => {
		try {
			const order = await Order.findOne({ _id: req.params.id });
			let instructions = order.instructions;
			let artDirection = '';
			if (order.currentStatus === 'A. Waiting for Proof') {
				if (instructions.length > 0) {
					let instruction = instructions[instructions.length - 1];
					if (instruction.instructionType === 'Art Direction') {
						artDirection = instructions[instructions.length - 1].instruction;
					}
				}
			}
			if (
				!order.use2020Pricing ||
				order.use2020Pricing === '' ||
				order.use2020Pricing === undefined ||
				order.use2020Pricing === false
			) {
				order.use2020Pricing = false;
			} else {
				order.use2020Pricing = true;
			}

			const customArtists = await CustomArtist.find();
			res.render('orders/edit', { order, customArtists, artDirection });
		} catch (err) {
			logger.error(err);
		}
	},

	// @desc    Update single order
	// @route   POST /orders/edit/:id
	// @access  Private - Edit Orders Role
	updateOrder: async (req, res, next) => {
		try {
			let id = req.params.id;
			let {
				priority,
				currentArtist,
				currentStatus,
				vendor,
				jbaPONum,
				latestShipDate,
				accountNum,
				instruction,
				estValue,
				currency,
				latestInHand,
				eventDate,
				use2020Pricing
			} = req.body;

			let foundOrder = await Order.findById(id);
			foundOrder.currentArtist = currentArtist;
			foundOrder.priority = priority;
			foundOrder.estValue = estValue;
			foundOrder.currency = currency;
			foundOrder.accountNum = accountNum;
			foundOrder.currentStatus = currentStatus;
			foundOrder.use2020Pricing = use2020Pricing || false;

			if (foundOrder.currentStatus === 'A. Waiting for Proof') {
				if (foundOrder.proofRequestDate === null) {
					foundOrder.proofRequestDate = dayjs().format();
				}

				if (!instruction) {
					req.flash('error_msg', 'Art Direction required - Try Again');
					return res.redirect(`/orders/edit/${id}`);
				}

				foundOrder.instructions.push({
					instruction,
					instructionType: 'Art Direction',
					user: foundOrder.isr
				});
			}

			if (
				foundOrder.currentStatus === 'A. Waiting for Proof' ||
				foundOrder.currentStatus === 'G. Waiting for Revision' ||
				foundOrder.currentStatus === 'M. Waiting for Output' ||
				foundOrder.currentStatus === 'W. CANCELLED' ||
				foundOrder.currentStatus === 'X. Archived'
			) {
				foundOrder.currentArtist = '';
			}

			if (foundOrder.currentStatus === 'U. Uploaded') {
				if (foundOrder.signedOffDate === null) {
					req.flash('error_msg', 'Order not signed off yet');
					return res.redirect(`/orders/edit/${id}`);
				}

				if (foundOrder.uploadDate === null) {
					foundOrder.uploadDate = dayjs().format();
					foundOrder.sentVendor = null;

					let date1 = dayjs(foundOrder.uploadDate);
					let date2 = dayjs(foundOrder.signedOffDate);
					let diff = new DateDiff(date1, date2);
					const outputTurnaround = parseInt(diff.days() + 1);
					foundOrder.outputTurnaround = outputTurnaround;
					let reportWeek = moment(dayjs().format()).format('W');
					let reportYear = dayjs().format('YYYY');
					let reportMonth = moment(dayjs().format()).format('M');
					let reportWeekRange = getDateRangeOfWeek(reportWeek, reportYear);
					let outputAvg = 0;

					let updatedReport = await Report.findOneAndUpdate(
						{
							reportWeekNumber: reportWeek,
							reportYear: reportYear,
							reportWeekRange: reportWeekRange,
							reportMonth: reportMonth
						},
						{
							$inc: { outputCompleted: 1 },
							$push: { outputTurnArounds: outputTurnaround }
						},
						{
							upsert: true,
							new: true
						}
					);

					let length = updatedReport.outputTurnArounds.length;
					let sum = 0;
					for (let i = 0; i < length; i++) {
						sum += parseInt(updatedReport.outputTurnArounds[i], 10);
					}

					outputAvg = Math.round(sum / length);

					await Report.updateOne(
						{ _id: updatedReport._id },
						{ $set: { avgOutput: outputAvg } }
					);
				}
			}

			if (foundOrder.currentStatus === 'V. Sent to Vendor') {
				if (foundOrder.signedOffDate === null) {
					req.flash('error_msg', 'Order not signed off');
					return res.redirect(`/orders/edit/${id}`);
				}

				if (foundOrder.sentVendor === null) {
					foundOrder.sentVendor = dayjs().format();
				}
			}

			if (foundOrder.currentStatus === 'M. Waiting for Output') {
				if (foundOrder.needSketch) {
					req.flash('error_msg', 'Cannot Sign Off - Mock Requested');
					return res.redirect(`/orders/edit/${id}`);
				}

				if (foundOrder.signedOffDate === null) {
					foundOrder.signedOffDate = dayjs().format();
					let reportWeek = moment(dayjs().format()).format('W');
					let reportYear = dayjs().format('YYYY');
					let reportMonth = moment(dayjs().format()).format('M');

					let reportWeekRange = getDateRangeOfWeek(reportWeek, reportYear);

					await Report.findOneAndUpdate(
						{
							reportWeekNumber: reportWeek,
							reportYear: reportYear,
							reportWeekRange: reportWeekRange,
							reportMonth: reportMonth
						},
						{
							$inc: { signOffs: 1 }
						},
						{
							upsert: true,
							new: true
						}
					);
				}
			}

			if (foundOrder.currentStatus === 'F. Proof Complete') {
				if (foundOrder.proofRequestDate === null) {
					req.flash('error_msg', 'Proof not requested - Cannot complete');
					return res.redirect(`/orders/edit/${id}`);
				}

				if (foundOrder.proofCompletionDate === null) {
					foundOrder.proofCompletionDate = dayjs().format();
					let date1 = dayjs(foundOrder.proofCompletionDate);
					let date2 = dayjs(foundOrder.proofRequestDate);
					let diff = new DateDiff(date1, date2);
					const proofTurnaround = parseInt(diff.days() + 1);
					foundOrder.proofTurnaround = proofTurnaround;

					let reportWeek = moment(dayjs().format()).format('W');
					let reportYear = dayjs().format('YYYY');
					let reportMonth = moment(dayjs().format()).format('M');

					let reportWeekRange = getDateRangeOfWeek(reportWeek, reportYear);

					let proofsAvg = 0;

					let updatedReport = await Report.findOneAndUpdate(
						{
							reportWeekNumber: reportWeek,
							reportYear: reportYear,
							reportWeekRange: reportWeekRange,
							reportMonth: reportMonth
						},
						{
							$inc: { proofsCompleted: 1 },
							$push: { proofTurnArounds: proofTurnaround }
						},
						{ upsert: true, new: true }
					);

					let length = updatedReport.proofTurnArounds.length;
					let sum = 0;
					for (let i = 0; i < length; i++) {
						sum += parseInt(updatedReport.proofTurnArounds[i]);
					}
					proofsAvg = Math.round(sum / length);

					await Report.updateOne(
						{
							_id: updatedReport._id
						},
						{ $set: { avgProofs: proofsAvg } }
					);
				}
			}

			if (foundOrder.currentStatus === 'L. Revision Complete') {
				if (foundOrder.revisionRequestDate == null) {
					req.flash('error_msg', 'Revision not requested - Cannot complete');
					return res.redirect(`/orders/edit/${id}`);
				}

				if (foundOrder.revisionCompletionDate === null) {
					foundOrder.revisionCompletionDate = dayjs().format();

					let date1 = dayjs(foundOrder.revisionCompletionDate);
					let date2 = dayjs(foundOrder.revisionRequestDate);
					let diff = new DateDiff(date1, date2);
					const revisionTurnaround = parseInt(diff.days() + 1);

					let reportWeek = moment(dayjs().format()).format('W');
					let reportYear = dayjs().format('YYYY');
					let reportMonth = moment(dayjs().format()).format('M');

					let reportWeekRange = getDateRangeOfWeek(reportWeek, reportYear);
					let revisionsAvg = 0;

					let updatedReport = await Report.findOneAndUpdate(
						{
							reportWeekNumber: reportWeek,
							reportYear: reportYear,
							reportWeekRange: reportWeekRange,
							reportMonth: reportMonth
						},
						{
							$inc: { revisionsCompleted: 1 },
							$push: { revisionTurnArounds: revisionTurnaround }
						},
						{ upsert: true, new: true }
					);

					let length = updatedReport.revisionTurnArounds.length;
					let sum = 0;
					for (let i = 0; i < length; i++) {
						sum += parseInt(updatedReport.revisionTurnArounds[i], 10);
					}
					revisionsAvg = Math.round(sum / length);

					await Report.updateOne(
						{
							_id: updatedReport._id
						},
						{ $set: { avgRevisions: revisionsAvg } }
					);
				}
			}

			foundOrder.vendor = vendor;
			foundOrder.jbaPONum = jbaPONum;
			if (latestShipDate) {
				foundOrder.latestShipDate = dayjs(latestShipDate)
					.set('hour', 7)
					.format('YYYY-MM-DD HH:mm:ss');
			}

			if (latestInHand) {
				foundOrder.latestInHand = dayjs(latestInHand)
					.set('hour', 7)
					.format('YYYY-MM-DD HH:mm:ss');
			}

			if (eventDate) {
				foundOrder.eventDate = dayjs(eventDate)
					.set('hour', 7)
					.format('YYYY-MM-DD HH:mm:ss');
			}

			if (
				foundOrder.balanceOutstanding != null &&
				foundOrder.balanceOutstanding != undefined
			) {
				if (foundOrder.balanceOutstanding > 0) {
					foundOrder.paymentStatus = 'Balance Outstanding';
				} else if (foundOrder.balanceOutstanding < 0) {
					foundOrder.paymentStatus = 'Refund Customer';
				} else if (foundOrder.balanceOutstanding == 0) {
					foundOrder.paymentStatus = 'Complete';
				}
			}

			await foundOrder.save();
			logger.info(`${foundOrder.orderNum} - update by ${req.user.username}`);
			req.flash('success_msg', 'Order Updated');
			res.redirect(`/orders/view/${id}`);
		} catch (err) {
			logger.error(err);
		}
	},

	// @desc    View notes edit page for single note
	// @route   GET /orders/note-edit/:noteId
	// @access  Private - Edit Orders Role
	getEditNotePage: async (req, res, next) => {
		try {
			const order = await Order.findOne({
				'instructions._id': req.params.noteid
			});
			const note = order.instructions.id(req.params.noteid);
			res.render('orders/note-edit', { note });
		} catch (err) {
			logger.error(err);
		}
	},

	// @desc    Add new note to order
	// @route   PUT /orders/notes/:id
	// @access  Private - Edit Orders Role
	addNote: async (req, res, next) => {
		try {
			const { instruction, noteUser } = req.body;

			if (instruction) {
				const updatedOrder = await Order.findByIdAndUpdate(
					req.params.id,
					{
						$push: {
							instructions: {
								instruction: instruction,
								instructionType: 'Note',
								user: noteUser
							}
						}
					},
					{ new: true }
				);

				req.flash('success_msg', 'Note Added');
				res.redirect(`/orders/view/${req.params.id}`);
			} else {
				req.flash('error_msg', 'Note empty - Try again');
				res.redirect(`/orders/view/${req.params.id}`);
			}
		} catch (err) {
			logger.error(err);
		}
	},

	// @desc    Update single note
	// @route   PUT /orders/note-edit/:noteId
	// @access  Private - Edit Orders Role
	updateNote: async (req, res, next) => {
		try {
			let { instruction, isr, instructionType } = req.body;
			let foundOrder = await Order.findOne({
				'instructions._id': req.params.noteid
			});
			let note = foundOrder.instructions.id(req.params.noteid);
			let id = foundOrder.id;
			if (instruction) {
				note.instruction = instruction;
				note.isr = isr;
				note.instructionType = instructionType;
				await foundOrder.save();
				req.flash('success_msg', 'Note Updated');
				return res.redirect(`/orders/view/${id}`);
			}
			req.flash('error_msg', 'Blank note ignored - Try again');
			res.redirect(`/orders/view/${id}`);
		} catch (err) {
			logger.error(err);
		}
	},

	// @desc    Add new revision to order
	// @route   PUT /orders/revision/:id
	// @access  Private - Edit Orders Role
	addRevision: async (req, res, next) => {
		try {
			const { instruction, isr } = req.body;
			if (!instruction) {
				req.flash('error_msg', 'Instruction required - Try Again.');
				return res.redirect(`/orders/view/${req.params.id}`);
			}

			const updatedOrder = await Order.findByIdAndUpdate(
				req.params.id,
				{
					currentStatus: 'G. Waiting for Revision',
					currentArtist: '',
					revisionRequestDate: dayjs().format(),
					revisionCompletionDate: null,
					$push: {
						instructions: {
							instruction: instruction,
							instructionType: 'Revision',
							user: isr
						}
					}
				},
				{ new: true }
			);

			logger.info(
				`${updatedOrder.orderNum} - revision request by ${req.user.username}`
			);

			req.flash('success_msg', 'Revision Requested');
			res.redirect(`/orders/view/${req.params.id}`);
		} catch (err) {
			logger.error(err);
		}
	}
};
