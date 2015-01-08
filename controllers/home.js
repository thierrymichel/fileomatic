/*jslint browser: true, devel: true, node: true, indent: 2 */
'use strict';
module.exports = function homeController(app) {
  app.get('/', function (req, res) {
    res.render('home', { title: 'Welcome to MisterQ!' });
    // console.log(req);
  });
};
