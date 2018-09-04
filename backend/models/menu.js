const mongoose = require('mongoose');
const menuSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imagePath: {type: String, required: true },
  creator: {type: mongoose.SchemaTypes.ObjectId , ref: 'User', required: true}
});

module.exports = mongoose.model('Menu', menuSchema);
