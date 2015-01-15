/*jslint node: true, indent: 2, nomen: true */
'use strict';

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fileomatic');

var db = mongoose.connection;
db.on('error', function () {
  console.error('✘ CANNOT CONNECT TO mongoDB DATABASE fileomatic!'.red);
});

module.exports = function (onceReady) {
  if (onceReady) {
    db.on('open', onceReady);
  }
};
