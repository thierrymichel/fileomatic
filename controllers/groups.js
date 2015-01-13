/*jslint node: true, nomen: true, indent: 2 */

'use strict';

/*
 * Groups controller
 */

// var async     = require('async');
var Q         = require('q');
var Group     = require('../models/group');
var User      = require('../models/user');
var realTime  = require('../controllers/web-sockets');

function displayGroup(req, res) {
  // si session, on affiche le groupe en détails
  if (req.session.userId) {
    Q
      .all([
        User.getServing(req.params.id),
        User.getPending(req.params.id),
        User.getWatching(req.params.id)
      ])
      .then(function (results) {
        // console.log(results);
        res.render('group', {
          server: results[0],
          penders: results[1],
          watchers: results[2]
        });
        console.log('current status', req.session.userStatus);
      });
  } else {
    res.redirect('/');
  }
}

function joinGroup(req, res) {
  // check if already joined (refresh)
  if (req.body.pseudo === req.session.userPseudo) {
    console.log('already here!');
    User.remove({
      pseudo: req.session.userPseudo,
      groupId: req.session.groupId
    }, function () {
      console.log('deleted!');
      realTime.sockets.emit('leaving', {
        action: 'leaving',
        id: req.session.userId
      });
      // req.flash('success', 'Goodbye!');
      req.session = null;   // "fin" session
      res.redirect('/');
    });
  } else {
    // else create, register, etc…
    Q
      .all([
        User.create({ pseudo: req.body.pseudo, groupId: req.body.groupId }),
        Group.findById(req.body.groupId).exec()
      ])
      .spread(function (user, group) {

        // set cookies for next time (homepage)
        res.cookie('pseudo', user.pseudo);
        // save session informations (pour quoi faire si pas de rechargement possible du groupe ? Peut-être mis dans le "render" ?)
        req.session.userId = user._id;
        req.session.userPseudo = user.pseudo;
        req.session.userStatus = user.status;
        req.session.groupId = group._id;
        req.session.groupName = group.name;

        // notify all the users (may be should use broadcast ?)
        realTime.sockets.emit('joining', {
          action: 'joining',
          id: req.session.userId,
          pseudo: req.session.userPseudo
        });

        // Get the content of the group
        Q
          .all([
            User.getServing(req.body.groupId),
            User.getPending(req.body.groupId),
            User.getWatching(req.body.groupId)
          ])
          .then(function (results) {
            res.render('group', {
              server: results[0],
              penders: results[1],
              watchers: results[2]
            });
          });
      });
  }
}
function handleGroup(req, res) {
  // si pas de methode additionnelle (DELETE ou PUT)
  var method = req.query._method || 'POST';

  switch (method) {
  case 'DELETE':
    User.findByIdAndRemove(req.session.userId, function () {
      realTime.sockets.emit('leaving', {
        action: 'leaving',
        id: req.session.userId
      });
      // req.flash('success', 'Goodbye!');
      req.session = null;   // "fin" session
      res.redirect('/');
    });
    break;
  }
}

module.exports = function queueController(app) {
  app.post('/groups', joinGroup);
  // finalement, pas de display direct via GET... On "join" via POST et puis c'est tout !
  // Sinon, on repasse par la case départ :)))
  app.route('/groups/:id')
    // .get(displayGroup)
    .get(function (req, res) {
      req.session = null;
      res.redirect('/');
    })
    .post(handleGroup);
};


// Utilisation de 'async' + note
/* Note
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
  Pour plus tard essayer avec les Promises plutôt que 'async' (genre module Q -> voir supra !!!)
  */
/*
async.parallel(
  {
    user: function (callback) {
      User.create({ pseudo: req.body.pseudo, groupId: req.body.groupId }, callback);
    },
    group: function (callback) {
      Group.findById(req.body.groupId, callback);
    }
  },
  function (error, result) {
    // do stuff after all
  }
);
*/
