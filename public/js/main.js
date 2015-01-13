/*jslint browser: true, devel: true, node: true, nomen: true, indent: 2 */
/*global jQuery, io */

(function ($) {
  'use strict';

  var $group;

  function initGroup() {

    /*
     * window handling
     */
    // alerte en cas refresh, close, etoussa
    window.onbeforeunload = function () {
      var msg = 'You will leave the group!';
      return msg;
    };
    // et redirect en cas de refresh
    $(window).on('unload', function () {
      console.log('bye bye…');
      window.location = 'http://localhost:8080/';
    });
    // sauf lorsqu'on clique sur LEAVE
    $('.leave').on('submit', function () {
      // e.preventDefault();
      window.onbeforeunload = null;
      $(window).off('unload');
    });


  //   // show/hide controls
  //   if ($group.data('q-status') === 'watching') {
  //     $('.start').toggleClass('is-hidden');
  //   }
  //   if ($group.data('q-status') === 'pending') {
  //     $('.cancel').toggleClass('is-hidden');
  //   }

  //   // add actions
  //   $('.cancel').on('click', function (e) {
  //     e.preventDefault();
  //     console.log('(re)startwatching');

  //     $('.start').toggleClass('is-hidden');
  //     $group.data('q-status', 'watching');

  //     $.post(
  //       $group.data('q-url') + '?_method=DELETE'
  //     );
  //   });
  //   $('.start').on('click', function (e) {
  //     e.preventDefault();
  //     console.log('startpending');

  //     $('.start').toggleClass('is-hidden');
  //     $group.data('q-status', 'pending');

  //     $.post(
  //       $group.data('q-url')
  //     );
  //   });
  }

  function initSockets() {
    var socket = io.connect('http://localhost:8080');
    socket
      .on('connect', function () {
        console.log('register');
        socket.emit('register');
      });
/*      .on('joining', function (data) {
        console.log(data.action);
        $('.group__watching ul').append('<li data-q-id="' + data.id + '">' + data.pseudo + '</li>');
      })
      .on('leaving', function (data) {
        console.log(data.action);
        $('[data-q-id="' + data.id + '"]').fadeOut(300, function () {
          $(this).remove();
        });
      })
      .on('pending', function (data) {
        console.log(data.action);
        $('[data-q-id="' + data.id + '"]').fadeOut(300, function () {
          $(this)
            .appendTo('.group__pending ul')
            .fadeIn(300)
            .find('.cancel')
            .toggleClass('is-hidden');
        });
      })
      .on('watching', function (data) {
        console.log(data.action);
        $('[data-q-id="' + data.id + '"]').fadeOut(300, function () {
          $(this)
            .appendTo('.group__watching ul')
            .fadeIn(300)
            .find('.cancel')
            .toggleClass('is-hidden');
        });
      });
*/
  }

  function init() {
    $group = $('.group');
    if ($group.length) {
      initGroup();
      initSockets();
    }
  }

  init();

}(jQuery));
