const mongoose = require('mongoose');
const menuSchema = mongoose.Schema({
  title: String,
  description: String,
  items: {}
});

module.exports = mongoose.model('Menu', menuSchema);
