const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // plugin hook

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// define the plugin to be run on this schema
userSchema.plugin(uniqueValidator);


module.exports = mongoose.model('User', userSchema);
