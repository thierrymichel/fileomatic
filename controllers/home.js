/*jslint node: true, indent: 2 */
'use strict';

/*
 * Home controller
 */

var Queue = require('../models/queue');
var _ = require('underscore');

module.exports = function homeController(app) {
  app.get('/', function (req, res) {
    Queue
      .getAll()
      .then(function (queues) {
        res.render('home', { title: 'Welcome to MisterQ!', queues: queues });
      });
  });
};
