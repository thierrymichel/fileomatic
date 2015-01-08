/*jslint browser: true, devel: true, node: true, indent: 2 */
'use strict';

/*
 * Queue controller
 */

module.exports = function queueController(app) {
  app.get('/queue/:name/', function (req, res) {
    console.log(req.params.name);
    res.render('home', { title: 'Welcome to ' + req.params.name });
  });
};
