const Orders = require('../models/order');
const checkAuth = require('../middlewear/check-auth');

// create order
exports.createOrder = (req, res, next) => {
  const newOrder = new Orders(req.body);
  console.log('new order: ', newOrder);
  newOrder
    .save()
    .then(createdOrder => {
      if (createdOrder) {
        res.status(200).json({
          message: 'Order Added',
          order: createdOrder
        });
      } else {
        res.status(201).json({ message: 'Order Not Added' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Creating a order Failed!'
      });
    });
};

// import csv order from legacy system
exports.importCustomerOrder = ('/orders/import',
checkAuth,
(req, res, next) => {
  const csvFilePath = req.file.path;
  const csv = require('csvtojson');
  csv()
    .fromFile(csvFilePath)
    .then(jsonObj => {
      res.status(201).json({ message: 'file uploaded successfully', data: jsonObj });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Importing the order Failed!'
      });
    });
});

// update an order
exports.updateSingleOrder = (req, res, next) => {
  console.log(req.body._id);
  const newOrder = new Orders({
    menuName: req.body.menuName,
    customerDetails: req.body.customerDetails,
    orderedItems: req.body.orderedItems,
    eventDetails: req.body.eventDetails,
    notes: req.body.notes,
    _id: req.body._id
  });
  console.log(`new  order = ${newOrder}`);

  Orders.updateOne({ _id: req.body._id }, newOrder)
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: 'Order updated successfully', responseCode: 200 });
      } else {
        res.status(401).json({ message: 'Not Authorized!', responseCode: 401 });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
};

// list all orders
exports.getOrders = (req, res, next) => {
  Orders.find()
    .then(documents => {
      // console.log(`returning ${documents.length} documents`);
      res.status(200).json({ message: 'orders fetched successfully', orders: documents });
    })
    .catch(error => {
      res.status(500).json({ message: 'Fetching Orders Failed!' });
    });
};

// delete an order

exports.deleteOrder = (req, res, next) => {
  const orderId = req.params.id;
  console.log(orderId);
  Orders.deleteOne({ _id: orderId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: 'order deleted', responseCode: '200' });
      } else {
        res.status(401).json({ message: 'Not Authorized!' });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
};
