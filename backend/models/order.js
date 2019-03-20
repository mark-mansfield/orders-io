const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({
  menuName: String,
  customerDetails: {},
  orderedItems: {}
});

module.exports = mongoose.model('Order', orderSchema);
