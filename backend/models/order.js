const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({
  menuName: String,
  customerDetails: {},
  orderedItems: {},
  eventDetails: {}
});

module.exports = mongoose.model('Order', orderSchema);
