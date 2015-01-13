/*jslint node: true, indent: 2, nomen: true */
'use strict';

var mongoose = require('mongoose');
var _ = require('underscore');

var groupSchema = mongoose.Schema({
  name:         { type: String, required: true },
  createdAt:    { type: Date, default: Date.now },
  description:  { type: String, required: true },
  userNb:       { type: Number, default: 0 }
});

_.extend(groupSchema.statics, {
  getAll: function getAllGroups() {
    return this
      .find()
      .sort({ name: 'asc' })
      .exec();
  },
  getOne: function getGroupById(groupId) {
    return this
      .findById(groupId)
      .exec();
  }
});

module.exports = mongoose.model('Group', groupSchema);
