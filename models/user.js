/*jslint node: true, indent: 2, nomen: true */
'use strict';

var mongoose = require('mongoose');
var _ = require('underscore');

var userSchema = mongoose.Schema({
  pseudo:   { type: String, required: true },
  groupId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  joinedAt: { type: Date, default: Date.now },
  queuedAt: { type: Date },
  ticket:   { type: Number, default: 0 },
  status:   { type: String, default: 'watching'}
});

_.extend(userSchema.statics, {
  getAll: function getAllUsers(groupId) {
    return this
      .find({ groupId: groupId })
      .sort({ joinedAt: 'asc' })
      .exec();
  },
  getWatching: function getAllWatchingUsers(groupId) {
    return this
      .find({ groupId: groupId, status: 'watching' })
      .sort({ joinedAt: 'asc' })
      .exec();
  },
  getPending: function getAllPendingUsers(groupId) {
    return this
      .find({ groupId: groupId, status: 'pending' })
      .sort({ queuedAt: 'asc' })
      .exec();
  },
  getServing: function getServingUser(groupId) {
    return this
      .findOne({ groupId: groupId, status: 'serving' })
      .exec();
  }
});

module.exports = mongoose.model('User', userSchema);
