const Order = require('../models/order');
const checkAuth = require('../middlewear/check-auth');

exports.createOrder = (req, res, next) => {
  const order = new Order(req.body);

  // mongoose  automatically creates the collection based upon the Model name it used during Models.exports for this object use node
  order
    .save()
    .then(createdOrder => {
      if (createdOrder) {
        res.status(200).json({
          message: 'Order Added',
          order: order
        });
      } else {
        res.status(201).json({ message: 'Order Not Added' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Creating a order Failed!'
      });
    });
};

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

exports.getOrders = (req, res, next) => {
  Order.find()
    .then(documents => {
      // console.log(`returning ${documents.length} documents`);
      res.status(200).json({ message: 'orders fetched successfully', orders: documents });
    })
    .catch(error => {
      res.status(500).json({ message: 'Fetching Orders Failed!' });
    });
};
