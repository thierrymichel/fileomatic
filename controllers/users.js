/*jslint node: true, nomen: true, indent: 2 */

'use strict';

/*
 * Queue controller
 */

var async     = require('async');
var Q         = require('q');
var Group     = require('../models/group');
var User      = require('../models/user');
var realTime  = require('../controllers/web-sockets');

function handleUser(req, res) {
  // si pas de methode additionnelle (DELETE ou PUT)
  var method = req.query._method || 'POST',
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
    break;

  // (re)start watching
  case 'DELETE':
    changes = {
      $set: { status: 'watching' },
      $unset: { queuedAt: ''}
    };
    break;
  }

  User.findByIdAndUpdate(req.session.userId, changes, function () {
    realTime.sockets.emit(changes.$set.status, {
      action: changes.$set.status,
      id: req.session.userId
    });
    req.session.userStatus = changes.$set.status;
    console.log('new status', req.session.userStatus);
    //res.redirect('/groups/' + req.session.groupId);
  });
}

module.exports = function queueController(app) {
  app.post('/groups/:id/users/:usr', handleUser);
};
