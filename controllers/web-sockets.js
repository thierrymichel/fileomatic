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
      // on client connection, join the right room
      .on('register', function (data) {
        console.log('register on socket #' + socket.id);
        socket.join(data.group);
      })
      .on('closing', function (data) {
        console.log('closing from socket #' + socket.id);
        socket.broadcast.to(data.group).emit('closed', {
          action: 'closed'
        });
      });
  });

  singleton.sockets = ws.sockets;
};
