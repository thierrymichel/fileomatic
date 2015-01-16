/*jslint browser: true, devel: true, node: true, nomen: true, indent: 2 */
/*global jQuery, io */

(function ($) {
  'use strict';

  var origin = window.location.origin,
    $group,
    groupId,
    socket;

  function initGroup() {

    var url = $group.data('q-url');
    groupId = $group.data('q-group');

    /*
     * window handling
     */
    // alerte en cas refresh, close, etoussa
    window.onbeforeunload = function () {
      var msg = 'Attetion, tu vas quitter ce groupe !';
      return msg;
    };
    // et redirect en cas de refresh (pas redirect mais action leave/close)
    $(window).on('unload', function () {
      console.log('bye bye…');
      // window.location = origin;
      $('.leave, .close').trigger('submit');
    });
    // sauf lorsqu'on clique sur LEAVE / CLOSE
    $('.leave, .close').on('submit', function () {
      // e.preventDefault();
      window.onbeforeunload = null;
      $(window).off('unload');
    });
    $('.close').on('submit', function () {
      socket.emit('closing', { group: groupId });
    });

    /*
     * Controls settings
     */

    // add hidden "cancel" link
    $('<a href="#" class="get-out">annuler</a>')
      .hide()
      .appendTo('.active');

    // get in/out the queue
    // get the ID of the clicked item
    // hide the clicked link/button
    // post ajax call
    $group.on('click', '.get-in, .get-out, .get-serve', function (e) {
      e.preventDefault();

      var $this = $(this),
        action = $this.attr('class'),
        userId = $this.parent('li').data('q-id'),
        actionURL = url;

      switch (action) {

      case 'get-out':
        actionURL += '?action=watching';
        break;

      case 'get-in':
        actionURL += '?action=pending';
        break;

      case 'get-serve':
        actionURL += '?action=serving';
        break;
      }

      console.log(action);

      $this.hide();
      $.post(
        actionURL,
        {
          groupId: groupId,
          userId: userId
        }
      );
    });
  }

  /*
   * Sockets settings
   */
  function initSockets() {
    socket = io.connect(origin);
    socket
      .on('connect', function () {
        console.log('register');
        // join the right ROOM (= groupId)
        socket.emit('register', { group: groupId });
      })
      // when some user JOIN the group -> added to the watching list
      .on('joining', function (data) {
        console.log(data.action);
        $('.group__watching .list').append('<li data-q-id="' + data.id + '">' + data.pseudo + '</li>');
      })
      // or LEAVE -> removed from any list
      .on('leaving', function (data) {
        console.log(data.action);
        $('[data-q-id="' + data.id + '"]').fadeOut(300, function () {
          $(this).remove();
        });
      })

      // or GET-OUT the queue -> from pending/serving to watching
      .on('watching', function (data) {

        console.log(data.action);

        $('[data-q-id="' + data.id + '"]').fadeOut(300, function () {
          var $this = $(this);

          if ($group.hasClass('admin')) {
            $this.find('.get-serve').remove();
            $this.find('.get-out').remove();
            $('.get-serve').show();
          }

          $this.find('.ticket').remove();
          $this
            .appendTo('.group__watching .list')
            .fadeIn(300);

          $this.find('.get-in').show();
        });
      })
      // or GET-IN the queue -> from watching to pending
      .on('pending', function (data) {

        console.log(data.action);

        $('[data-q-id="' + data.id + '"]').fadeOut(300, function () {
          var $this = $(this);

          if ($group.hasClass('admin')) {
            $this.append('<a href="#" class="get-serve">servir</a>');
          }

          $this
            .prepend('<strong class="ticket">' + data.ticket + '</strong>')
            .appendTo('.group__pending .list')
            .fadeIn(300);
          $this.find('.get-out').show();

        });
      })
      // or GET-SERVE the queue -> from pending to serving
      .on('serving', function (data) {

        console.log(data.action);

        $('[data-q-id="' + data.id + '"]').fadeOut(300, function () {
          var $this = $(this);

          if ($group.hasClass('admin')) {
            $this.find('.get-serve').remove();
            $('.get-serve').hide();
            $this.append('<a href="#" class="get-out">terminé</a>');
          } else {
            $this.find('.get-out').hide();
          }
          $this
            .appendTo('.group__serving .list')
            .fadeIn(300);
        });
      })
      // or admin CLOSE the group
      .on('closed', function (data) {
        console.log(data.action);
        window.alert('Le groupe a été fermé par l\'admin !');
        window.setTimeout(
          function () {
            // window.location = origin;
            $('.leave').trigger('submit');
          },
          500
        );
      });
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
