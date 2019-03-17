const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({
  menuName: { type: String, required: true },
  customerDetails: { type: [], required: true },
  orderedItems: { type: [], required: true }
});

module.exports = mongoose.model('Order', orderSchema);
