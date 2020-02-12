const express = require('express');
const router = express.Router();

const { ensureAuthenticated, ensureEditOrders } = require('../helpers/auth');

const {
	getAllOrders,
	showOrderPO,
	showOrderXML,
	getInProgressOrders,
	getInitialOrders,
	getCompletedOrders,
	getCancelledOrders,
	getArchivedOrders,
	getAddOrderPage,
	addOrder,
	viewOrderPage,
	getEditOrderPage,
	updateOrder,
	getEditNotePage,
	addNote,
	updateNote,
	addRevision
} = require('../controllers/orders');

router.route('/all').get(ensureAuthenticated, getAllOrders);
router.route('/').get(ensureAuthenticated, getInProgressOrders);
router.route('/initial').get(ensureAuthenticated, getInitialOrders);
router.route('/completed').get(ensureAuthenticated, getCompletedOrders);
router.route('/cancelled').get(ensureAuthenticated, getCancelledOrders);
router.route('/archived').get(ensureAuthenticated, getArchivedOrders);

router
	.route('/add')
	.get(ensureAuthenticated, getAddOrderPage)
	.post(ensureAuthenticated, ensureEditOrders, addOrder);

router.route('/view/:id').get(ensureAuthenticated, viewOrderPage);

router
	.route('/edit/:id')
	.get(ensureAuthenticated, ensureEditOrders, getEditOrderPage)
	.put(ensureAuthenticated, ensureEditOrders, updateOrder);

router
	.route('/note-edit/:noteid')
	.get(ensureAuthenticated, ensureEditOrders, getEditNotePage)
	.put(ensureAuthenticated, ensureEditOrders, updateNote);

router.route('/notes/:id').put(ensureAuthenticated, ensureEditOrders, addNote);

router
	.route('/revision/:id')
	.put(ensureAuthenticated, ensureEditOrders, addRevision);

router.route('/po/:orderNum').get(ensureAuthenticated, showOrderPO);

router.route('/xml/:orderNum').get(ensureAuthenticated, showOrderXML);

module.exports = router;
