const express = require('express');
const router = express.Router();
const DateDiff = require('date-diff');
const dayjs = require('dayjs');
const logger = require('../helpers/logs');

const { ensureAuthenticated, ensureViewProd, ensureEditProd } = require('../helpers/auth');

// includes model for mongodb
const Order = require('../models/Order');

// @DESC - GETS ALL ORDERS AND DISPLAYS IN PROD TABLE
// SEC - MUST BE LOGGED IN - MUST HAVE VIEW PROD ACCESS
router.get('/', [ensureAuthenticated, ensureViewProd], async (req, res) => {
  try {
    let pageTitle = 'Production';
    let orders;
    if (req.user.lgUser) {
      pageTitle = 'LG Production';
      orders = await Order.find({ currentStatus: 'V. Sent to Vendor', lgOrder: true });
    } else {
      orders = await Order.find({ currentStatus: 'V. Sent to Vendor' });
    }
    res.render('orders/prod', { orders, pageTitle });
  } catch (err) {
    logger.error(err);
  }
});

// router.get("/ccn", [ensureAuthenticated, ensureViewProd], (req, res) => {
//   Order.find({
//     currentStatus: "V. Sent to Vendor"
//   }).then(orders => {
//     res.render("orders/ccnview", {
//       orders
//     });
//   });
// });

router.get('/open', [ensureAuthenticated, ensureViewProd], async (req, res) => {
  try {
    let pageTitle = 'Open Orders';
    let orders;
    if (req.user.lgUser) {
      pageTitle = 'LG Open Orders';
      orders = await Order.find({
        $and: [{ currentStatus: 'V. Sent to Vendor' }, { $or: [{ shipStatus: '' }, { shipStatus: null }] }, { lgOrder: true }]
      });
    } else {
      orders = await Order.find({
        $and: [{ currentStatus: 'V. Sent to Vendor' }, { $or: [{ shipStatus: '' }, { shipStatus: null }] }]
      });
    }

    res.render('orders/prod', { orders, pageTitle });
  } catch (err) {
    logger.error(err);
  }
});

router.get('/pending', [ensureAuthenticated, ensureViewProd], async (req, res) => {
  try {
    let pageTitle = 'Shipped Orders';
    let orders;

    if (req.user.lgUser) {
      pageTitle = 'LG Shipped Orders';
      orders = await Order.find({
        $and: [{ currentStatus: 'V. Sent to Vendor' }, { vendorConfirmShip: { $ne: null } }, { shipStatus: 'Shipped' }, { lgOrder: true }]
      });
    } else {
      orders = await Order.find({
        $and: [{ currentStatus: 'V. Sent to Vendor' }, { vendorConfirmShip: { $ne: null } }, { shipStatus: 'Shipped' }]
      });
    }
    res.render('orders/prod', { orders, pageTitle });
  } catch (err) {
    logger.error(err);
  }
});

router.get('/cancelled', [ensureAuthenticated, ensureViewProd], async (req, res) => {
  try {
    let pageTitle = 'Cancelled Orders';
    let orders;

    if (req.user.lgUser) {
      pageTitle = 'LG Cancelled Orders';
      orders = await Order.find({ currentStatus: 'W. CANCELLED', lgOrder: true });
    } else {
      orders = await Order.find({ currentStatus: 'W. CANCELLED' });
    }
    res.render('orders/prod', { orders, pageTitle });
  } catch (err) {
    logger.error(err);
  }
});

// @DESC - GETS ORDER BY ID# AND DISPLAYS IN MODAL WITH EDITABLE FIELDS
// SEC - MUST BE LOGGED IN - MUST HAVE VIEW PROD ACCESS
router.get('/edit/:id', [ensureAuthenticated, ensureEditProd], (req, res) => {
  let id = req.params.id;
  Order.findOne({ _id: id }).then(order => {
    res.render('orders/prod-edit', {
      order
    });
  });
});

// @DESC - UPDATES ORDER BY ID# BASED ON CHANGES TO EDIT FORM
// SEC - MUST BE LOGGED IN - MUST HAVE VIEW PROD ACCESS
router.put('/edit/:id', [ensureAuthenticated, ensureEditProd], (req, res) => {
  const id = req.params.id;
  const {
    latestShipDate,
    vendorConfirmShip,
    jbaPONum,
    jbaGNRNum,
    jbaInvoiceNum,
    shipStatus,
    tracking,
    shippingNotes,
    netValue,
    currency,
    qty
  } = req.body;

  Order.findOne({ _id: id }, function(err, foundOrder) {
    if (err) {
      logger.error(err);
      return;
    } else {
      if (foundOrder.balanceOutstanding > 0) {
        foundOrder.paymentStatus = 'Balance Outstanding';
      } else if (foundOrder.balanceOutstanding < 0) {
        foundOrder.paymentStatus = 'Refund Customer';
      } else if (foundOrder.balanceOutstanding == 0) {
        foundOrder.paymentStatus = 'Complete';
      }
      if (latestShipDate) {
        foundOrder.latestShipDate = latestShipDate;
      }

      const sentVendor = foundOrder.sentVendor;
      if (vendorConfirmShip && sentVendor) {
        foundOrder.vendorConfirmShip = vendorConfirmShip;
        let date1 = dayjs(vendorConfirmShip);
        let date2 = dayjs(sentVendor);
        let diff = new DateDiff(date1, date2);
        const prodLeadTime = diff.days();
        foundOrder.prodLeadTime = parseInt(prodLeadTime);
      } else if (vendorConfirmShip && !sentVendor) {
        req.flash('error', 'No Sent to Vendor Date');
        res.redirect('/prod/edit/' + foundOrder._id);
        foundOrder.prodLeadTime = 0;
        return;
      } else {
        foundOrder.prodLeadTime = 0;
      }

      if (tracking != foundOrder.tracking) {
        foundOrder.tracking = tracking;
      }

      if (foundOrder.confirmDeliveryDate && vendorConfirmShip) {
        let date1 = dayjs(foundOrder.confirmDeliveryDate);
        let date2 = dayjs(vendorConfirmShip);
        let diff = new DateDiff(date1, date2);
        const shippingLeadTime = diff.days();
        foundOrder.shippingLeadTime = parseInt(shippingLeadTime);
      } else {
        foundOrder.shippingLeadTime = 0;
      }

      foundOrder.jbaPONum = jbaPONum;
      foundOrder.jbaGNRNum = jbaGNRNum;
      foundOrder.jbaInvoiceNum = jbaInvoiceNum;
      if ((foundOrder.jbaInvoiceNum != '' || foundOrder.jbaInvoiceNum != null) && foundOrder.jbaInvoiceDate === null) {
        foundOrder.jbaInvoiceDate = dayjs()
          .set('hour', 7)
          .format();
      }
      foundOrder.shipStatus = shipStatus;
      foundOrder.shippingNotes = shippingNotes;
      foundOrder.netValue = netValue;
      foundOrder.qty = qty;
      foundOrder.currency = currency;

      if (foundOrder.prodLeadTime !== 0 && foundOrder.shippingLeadTime !== 0) {
        foundOrder.totalLeadTime = foundOrder.prodLeadTime + foundOrder.shippingLeadTime;
      } else {
        foundOrder.totalLeadTime = 0;
      }

      foundOrder.save(function(err, updatedOrder) {
        if (err) {
          logger.error(err);
          return;
        } else {
          logger.info(`${updatedOrder.orderNum} - update by ${req.user.username}`);
          req.flash('success_msg', 'Order Production Updated');
          res.redirect('/prod');
        }
      });
    }
  });
});

module.exports = router;
