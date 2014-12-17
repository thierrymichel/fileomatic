/*jslint browser: true, devel: true, node: true, indent: 2 */
'use strict';
module.exports = function homeController(app) {
  app.get('/', function (req, res) {
    res.send('Express te dit bonjour !');
    console.log(req);
  });
};
