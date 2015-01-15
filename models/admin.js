/*jslint node: true, indent: 2, nomen: true */
'use strict';

var mongoose = require('mongoose');

var adminSchema = mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model('Admin', adminSchema);
