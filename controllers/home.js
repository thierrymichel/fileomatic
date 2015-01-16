/*jslint node: true, nomen: true, indent: 2 */
'use strict';

/*
 * Home controller
 */

var _ = require('underscore');
var Q = require('q');
var Group = require('../models/group');
var realTime  = require('../controllers/web-sockets');

module.exports = function homeController(app) {
  app.use('/', function (req, res, next) {
    app.locals.isAdmin = (req.user) ? true : false;
    return next();
  });

  app.get('/', function (req, res) {
    Q
      .all([
        Group.getOpened(),
        Group.getClosed()
      ])
      .then(function (results) {
        res.render('home', {
          opened: results[0],
          openedNames: _.pluck(results[0], 'name'),
          closed: results[1],
          closedNames: _.pluck(results[1], 'name')
        });
      });
  });
};
