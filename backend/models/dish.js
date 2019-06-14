const mongoose = require('mongoose');
const dishSchema = mongoose.Schema({
  name: String,
  description: String,
  portion_sizes: [],
  course: String
});

module.exports = mongoose.model('Dish', dishSchema);
