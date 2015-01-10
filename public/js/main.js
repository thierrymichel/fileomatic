/*jslint browser: true, devel: true, node: true, indent: 2 */
/*global jQuery, io */

(function ($) {
  'use strict';

  var $list;

  function initSockets() {

    console.log('initSockets!');

    var socket = io.connect();
    socket
      .on('join', function (data) {
        $list.append('<li data-q-id="' + data.id + '">' + data.pseudo + '</li>');
        //   socket.emit('my other event', { my: 'data' });
      })
      .on('leave', function (data) {
        $('[data-q-id="' + data.id + '"]').fadeOut(300, function () {
          $(this).remove();
        });
      });
  }

  function init() {
    $list = $('.logs');
    if ($list.length) {
      initSockets();
    }
  }

  init();

}(jQuery));
