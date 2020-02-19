const express = require('express');
const router = express.Router();

const { ensureAuthenticated, ensureEditOrders } = require('../helpers/auth');
const ordersController = require('../controllers/orders');

router.route('/all').get(ensureAuthenticated, ordersController.getAllOrders);

router
	.route('/')
	.get(ensureAuthenticated, ordersController.getInProgressOrders);

router
	.route('/initial')
	.get(ensureAuthenticated, ordersController.getInitialOrders);

router
	.route('/completed')
	.get(ensureAuthenticated, ordersController.getCompletedOrders);

router
	.route('/cancelled')
	.get(ensureAuthenticated, ordersController.getCancelledOrders);

router
	.route('/archived')
	.get(ensureAuthenticated, ordersController.getArchivedOrders);

router
	.route('/add')
	.get(ensureAuthenticated, ordersController.getAddOrderPage)
	.post(ensureAuthenticated, ensureEditOrders, ordersController.addOrder);

router
	.route('/view/:id')
	.get(ensureAuthenticated, ordersController.viewOrderPage);

router
	.route('/edit/:id')
	.get(ensureAuthenticated, ensureEditOrders, ordersController.getEditOrderPage)
	.put(ensureAuthenticated, ensureEditOrders, ordersController.updateOrder);

router
	.route('/note-edit/:noteid')
	.get(ensureAuthenticated, ensureEditOrders, ordersController.getEditNotePage)
	.put(ensureAuthenticated, ensureEditOrders, ordersController.updateNote);

router
	.route('/notes/:id')
	.put(ensureAuthenticated, ensureEditOrders, ordersController.addNote);

router
	.route('/revision/:id')
	.put(ensureAuthenticated, ensureEditOrders, ordersController.addRevision);

router
	.route('/po/:orderNum')
	.get(ensureAuthenticated, ordersController.showOrderPO);

router
	.route('/xml/:orderNum')
	.get(ensureAuthenticated, ordersController.showOrderXML);

module.exports = router;
