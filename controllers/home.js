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
        var avalaible = (req.user) ? results[1] : results[0],
          unavalaible = _.pluck((req.user) ? results[0] : results[1], 'name');

        res.render('home', {
          avalaible: avalaible,
          unavalaible: unavalaible
        });
      });
  });
};
