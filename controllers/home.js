/*jslint node: true, nomen: true, indent: 2 */
'use strict';

/*
 * Home controller
 */

var Group = require('../models/group');
var _ = require('underscore');
var realTime  = require('../controllers/web-sockets');

module.exports = function homeController(app) {
  app.get('/', function (req, res) {
    Group
      .getAll()
      .then(function (groups) {
        res.render('home', { groups: groups });
      });
  });
};
