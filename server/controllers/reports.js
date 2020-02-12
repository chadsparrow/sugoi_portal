const moment = require('moment');
const dayjs = require('dayjs');
const logger = require('../helpers/logs');

const Report = require('../models/Report');
const Order = require('../models/Order');

// @desc    Get art dept report
// @route   GET /reports/
// @access  Private - Admin role only
exports.getReport = async (req, res, next) => {
	try {
		const currentWeekNum = moment(dayjs().format()).format('W');
		const reports = await Report.find().sort({
			reportYear: -1,
			reportWeekNumber: -1
		});
		const report = await Report.findOne({ reportWeekNumber: currentWeekNum });
		res.render('reports/index', { reports, report });
	} catch (err) {
		logger.error(err);
	}
};

// @desc    Get report for items sold
// @route   GET /reports/items
// @access  Private - Admin role only
exports.getItemsSold = async (req, res, next) => {
	try {
		const pageTitle = 'Items Sold';
		let itemsOrdered = {};
		const orders = await Order.find({ currentStatus: 'V. Sent to Vendor' });

		for (order of orders) {
			let orderLines = order.orderLines;
			for (orderLine of orderLines) {
				let items = orderLine.items;
				for (item of items) {
					if (item.extendedDescription && !item.cancelled) {
						if (item.extendedDescription in itemsOrdered) {
							itemsOrdered[item.extendedDescription] += item.totalUnits;
						} else {
							itemsOrdered[item.extendedDescription] = item.totalUnits;
						}
					}
				}
			}
		}
		res.render('reports/items', { itemsOrdered, pageTitle });
	} catch (err) {
		logger.error(err);
	}
};

// @desc    Get linechart for reports
// @route   GET /reports/linechart
// @access  Private - Admin role only
exports.getLineChart = async (req, res, next) => {
	try {
		let proofsCompleted = [];
		let revisionsCompleted = [];
		let outputCompleted = [];
		let weekNumbers = [];
		let avgProofs = [];
		let avgRevisions = [];
		let avgOutput = [];
		const reports = await Report.find().sort({
			reportYear: 1,
			reportWeekNumber: 1
		});
		for (report of reports) {
			proofsCompleted.push(report.proofsCompleted);
			revisionsCompleted.push(report.revisionsCompleted);
			outputCompleted.push(report.outputCompleted);
			weekNumbers.push(report.reportWeekNumber);
			avgProofs.push(report.avgProofs);
			avgRevisions.push(report.avgRevisions);
			avgOutput.push(report.avgOutput);
		}
		res.render('reports/linechart', {
			proofsCompleted,
			revisionsCompleted,
			outputCompleted,
			weekNumbers,
			avgProofs,
			avgRevisions,
			avgOutput
		});
	} catch (err) {
		logger.error(err);
	}
};

// @desc    Get report for specific week number
// @route   GET /reports/week/:weekNum
// @access  Private - Admin role only
exports.getWeekReport = async (req, res, next) => {
	try {
		const weekNum = req.params.weekNum;
		const reports = await Report.find().sort({
			reportYear: -1,
			reportWeekNumber: -1
		});
		const report = await Report.findOne({ reportWeekNumber: weekNum });
		res.render('reports/index', { reports, report });
	} catch (err) {
		logger.error(err);
	}
};

// @desc    Get report for pre-production
// @route   GET /reports/preprod
// @access  Private - Admin role only
exports.getPreProdReport = async (req, res, next) => {
	try {
		let pageTitle = 'Pre-Production Report';
		const orders = await Order.find({
			currentStatus: {
				$not: { $in: ['V. Sent to Vendor', 'W. CANCELLED', 'X. Archived'] }
			}
		});

		let cadTotal = 0;
		let usdTotal = 0;

		for (order of orders) {
			if (order.netValue) {
				if (order.currency === 'CAD') {
					cadTotal += order.netValue;
				} else {
					usdTotal += order.netValue;
				}
			} else {
				if (order.estValue) {
					if (order.currency === 'CAD') {
						cadTotal += order.estValue;
					} else {
						usdTotal += order.estValue;
					}
				}
			}
		}
		res.render('reports/inprogress', { orders, pageTitle, cadTotal, usdTotal });
	} catch (err) {
		logger.error(err);
	}
};

// @desc    Get report for production
// @route   GET /reports/production
// @access  Private - Admin role only
exports.getProductionReport = async (req, res, next) => {
	try {
		let pageTitle = 'Production Report - Not Invoiced / Invoiced Today Only';

		const orders = await Order.find({
			$or: [
				{
					jbaInvoiceNum: { $in: ['', null] },
					currentStatus: 'V. Sent to Vendor'
				},
				{
					jbaInvoiceNum: { $nin: ['', null] },
					currentStatus: 'V. Sent to Vendor',
					jbaInvoiceDate: {
						$gte: dayjs().startOf('day'),
						$lte: dayjs().endOf('day')
					}
				}
			]
		});

		let cadTotal = 0;
		let usdTotal = 0;

		for (order of orders) {
			if (order.netValue) {
				if (order.currency === 'CAD') {
					cadTotal += order.netValue;
				} else {
					usdTotal += order.netValue;
				}
			}
		}

		res.render('reports/production', {
			orders,
			pageTitle,
			cadTotal,
			usdTotal
		});
	} catch (err) {
		logger.error(err);
	}
};
