/*jslint node: true, indent: 2, nomen: true */
'use strict';

var mongoose = require('mongoose');
var _ = require('underscore');

var queueSchema = mongoose.Schema({
  name:         { type: String, required: true, index: true },
  createdAt:    { type: Date, default: Date.now },
  description:  { type: String, required: true }
});

_.extend(queueSchema.statics, {
  getAll: function getAllQueues() {
    return this
      .find()
      .sort({ createdAt: -1 })
      .exec();
  },
  getName: function getNameQueue(id) {
    return this
      .findById(id)
      .exec();
  }
});
module.exports = mongoose.model('Queue', queueSchema);
