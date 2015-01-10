/*jslint node: true, indent: 2, nomen: true */
'use strict';

var mongoose = require('mongoose');
var _ = require('underscore');

var queuesLogSchema = mongoose.Schema({
  pseudo:   { type: String, required: true },
  queueId:  { type: String, ref: 'Queue', required: true },
  queuedAt: { type: Date },
  active:   { type: Boolean, default: false}
});

_.extend(queuesLogSchema.statics, {
  getLogs: function getQueueLogs(queueId) {
    return this
      .find({ queueId: queueId, active: true })
      .sort({ queuedAt: 'asc' })
      .exec();
  }
});

module.exports = mongoose.model('Log', queuesLogSchema);
