/*jslint node: true, indent: 2 */
'use strict';

var io = require('socket.io');
var User      = require('../models/user');

var singleton = module.exports = function socketsController(server) {
  if (singleton.sockets) {
    return;
  }

  var ws = io.listen(server);

  ws.on('connection', function (socket) {
    socket
      .on('disconnect', function () {
        console.log('disconnect on socket #' + socket.id);
      })
      .on('register', function () {
        console.log('register on socket #' + socket.id);
      });
  });

  singleton.sockets = ws.sockets;
};
