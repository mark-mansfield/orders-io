const express = require('express');
const router = express.Router();

// see controller files for methods
const OrderController = require('../controllers/orders');

const checkAuth = require('../middlewear/check-auth');

const extractCsvFile = require('../middlewear/csvFile');

// parse csv to Json
router.post('/import', checkAuth, extractCsvFile, OrderController.importCustomerOrder);

// create order
router.post('/create', checkAuth, extractCsvFile, OrderController.createOrder);

// get orders
router.get('/list', checkAuth, OrderController.getOrders);
// export the router
module.exports = router;
