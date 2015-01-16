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

function updateUser(req, res, groupId, userId, changes) {
  console.log('changes:' + changes.$set.status);

  User.findByIdAndUpdate(userId, changes, function () {
    realTime.sockets.in(groupId).emit(changes.$set.status, {
      action: changes.$set.status,
      id: userId,
      ticket: zeroFill(3, changes.$set.ticket)
    });
    req.session.userStatus = changes.$set.status;
    console.log('new status', req.session.userStatus);
    res.status(200).end();
    //res.redirect('/groups/' + req.session.groupId);
  });
}

function handleUser(req, res) {
  // si pas de methode additionnelle (DELETE ou PUT)
  var action = req.query.action || 'watching',
    userId = req.body.userId,
    groupId = req.body.groupId,
    changes = {};

  switch (action) {

  // (re)start watching
  case 'watching':
    changes = {
      $set: {
        status: 'watching',
        ticket: 0
      },
      $unset: { queuedAt: '' }
    };
    updateUser(req, res, groupId, userId, changes);
    break;

  // start pending
  case 'pending':
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
      updateUser(req, res, groupId, userId, changes);
    });
    break;

  case 'serving':
    changes = {
      $set : {
        status: 'serving'
      }
    };
    updateUser(req, res, groupId, userId, changes);
    break;
  }
}

module.exports = function userController(app) {
  app.post('/groups/:id/users/:usr', handleUser);
};
