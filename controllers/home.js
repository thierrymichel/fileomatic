/*jslint node: true, nomen: true, indent: 2 */
'use strict';

/*
 * Home controller
 */

var Group = require('../models/group');
var _ = require('underscore');
var realTime  = require('../controllers/web-sockets');

module.exports = function homeController(app) {
  app.use('/', function (req, res, next) {
    app.locals.isAdmin = (req.user) ? true : false;
    return next();
  });

  app.get('/', function (req, res) {
    Group
      .getAll()
      .then(function (groups) {
        res.render('home', { groups: groups });
      });
  });
};
