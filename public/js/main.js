/*jslint browser: true, devel: true, node: true, indent: 2 */
/*global jQuery, io */

(function () {
  'use strict';

  var list;

  function initSockets() {
    var socket = io.connect();
    socket.on('test', function (data) {
      console.log(data);
      var item = document.createElement('li');
      item.textContent = data.pseudo;
      list.appendChild(item);
    //   socket.emit('my other event', { my: 'data' });
    });
  }

  function init() {
    list = document.querySelector('.logs');
    if (list) {
      initSockets();
    }
  }
  init();
}());
