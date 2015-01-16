/*jslint node: true, nomen: true, indent: 2 */

'use strict';

/*
 * Queue controller
 */

// var async     = require('async');
var Q         = require('q');
var Group     = require('../models/group');
var User      = require('../models/user');
var zeroFill = require('zero-fill');
var realTime  = require('../controllers/web-sockets');

function updateUser(req, groupId, userId, changes) {
  User.findByIdAndUpdate(userId, changes, function () {
    realTime.sockets.in(groupId).emit(changes.$set.status, {
      action: changes.$set.status,
      id: req.session.userId,
      ticket: zeroFill(3, changes.$set.ticket)
    });
    req.session.userStatus = changes.$set.status;
    console.log('new status', req.session.userStatus);
    //res.redirect('/groups/' + req.session.groupId);
  });
}

function handleUser(req, res) {
  // si pas de methode additionnelle (DELETE ou PUT)
  var method = req.query._method || 'POST',
    userId = req.body.userId,
    groupId = req.body.groupId,
    changes = {};

  switch (method) {
  // start pending
  case 'POST':
    changes = {
      $set : {
        status: 'pending',
        queuedAt: Date.now()
      }
    };
    // get a ticket !
    Group.findByIdAndUpdate(groupId, { $inc: { ticket: 1 }}, function (err, group) {
      // console.log('get a ticket');
      changes.$set.ticket = group.ticket;
      updateUser(req, groupId, userId, changes);
    });
    break;

  // (re)start watching
  case 'DELETE':
    changes = {
      $set: {
        status: 'watching',
        ticket: 0
      },
      $unset: { queuedAt: '' }
    };
    updateUser(req, groupId, userId, changes);
    break;
  }
}

module.exports = function userController(app) {
  app.post('/groups/:id/users/:usr', handleUser);
};
