/*jslint node: true, indent: 2 */

'use strict';

/*
 * Queue controller
 */

var async = require('async');
var Queue = require('../models/queue');
var Log   = require('../models/log');

function listLogs(req, res) {
  // si session, on affiche les infos de la file
  if (req.session.id) {
    Log
      .getLogs(req.params.id)
      .then(function (logs) {
        res.render('queue', {
          user: req.session.pseudo,
          queueName: req.session.queueName,
          queueId: req.params.id,
          queueActive: req.session.queueActive,
          logs: logs
        });
      });

  // sinon go to home
  } else {
    res.redirect('/');
  }
}

function viewQueue(req, res) {
  console.log(req.body.pseudo + ' joined #' + req.params.id);

  async.parallel(
    {
      log: function (callback) {
        Log.create({ pseudo: req.body.pseudo, queueId: req.params.id }, callback);
      },
      queue: function (callback) {
        // Queue.getName(req.params.id, callback); // marche pô :(
        /* Notes
        .create() peut renvoyer une Promise ou être utilisé avec un callback (optionnel).
        C'est le cas avec le module 'async'.
        .findById() fonctionne de la même manière ! la méthode renvoie la query ou exécute le callback. Tout comme la méthode .exec() présente dans .getName()...
            ```
            getName: function getNameQueue(id) {
              return this
                .findById(id)
                .exec();
            }
            ```
        Mais comme .exec() est utilisé sans callback (et renvoit donc une Promise), getName() ne fonctionne pas dans ce contexte.
        Pfiouuu…
        Pour plus tard essayer avec les Promises plutôt que 'async' (genre module Q)
        */
        Queue.findById(req.params.id, callback);
      }
    },
    function (error, result) {
      console.log(result);
      req.session.id = result.log._id;
      req.session.pseudo = result.log.pseudo;
      req.session.queueId = result.queue._id;
      req.session.queueName = result.queue.name;
      res.redirect('/queues/' + req.session.queueId);
    }
  );
}

function joinQueue(req, res) {
  // update user/queue log...
  Log.findByIdAndUpdate(req.session.id, { active: true }, function () {
    req.session.queueActive = true;
    req.flash('success', 'Wait a minute!');
    res.redirect('/queues/' + req.session.queueId);
  });
}

function leaveQueue(req, res) {
  // delete user/queue log...
  Log.findByIdAndRemove(req.session.id, function () {
    req.flash('success', 'Goodbye!');
    req.session = null;   // "fin" session
    res.redirect('/');
  });
}

module.exports = function queueController(app) {
  app.route('/queues/:id')
    .get(listLogs)
    .post(viewQueue);
  app.post('/queues/:id/join', joinQueue);
  app.get('/queues/:id/leave', leaveQueue);
};
