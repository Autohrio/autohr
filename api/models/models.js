const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema({ });

module.exports = {
  User: mongoose.model('User', userSchema),
};