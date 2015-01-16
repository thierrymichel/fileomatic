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

var isRefreshed;

function displayGroup(req, res, groupId) {
  console.log('displayGroup');

  // Get the content of the group
  Q
    .all([
      User.getServing(groupId),
      User.getPending(groupId),
      User.getWatching(groupId)
    ])
    .then(function (results) {
      res.render('group', {
        server: results[0],
        penders: results[1],
        watchers: results[2]
      });
    });
}

function openGroup(req, res) {
  console.log('openGroup');
  if (!isRefreshed(req, res, 'master')) {
    var groupId = req.body.groupId;

    Group.findByIdAndUpdate(groupId, { $set: { openedAt: Date.now()}}, function (err, group) {
      req.session.userId = 'master';
      req.session.pseudo = 'master';
      req.session.groupId = group._id;
      req.session.groupName = group.name;

      // no notification needed (because the group was closed ;)

      displayGroup(req, res, groupId);
    });
  }
}

function joinGroup(req, res) {
  console.log('joinGroup');

  // check if already joined (refresh)
  if (!isRefreshed(req, res, req.body.pseudo)) {

    // create, register, etc…
    var pseudo = req.body.pseudo,
      groupId = req.body.groupId;

    Q
      .all([
        User.create({ pseudo: pseudo, groupId: groupId }),
        Group.findById(groupId).exec()
      ])
      .spread(function (user, group) {

        // set cookies for next time (homepage)
        res.cookie('pseudo', user.pseudo);
        // save session informations (pour quoi faire si pas de rechargement possible du groupe ? Peut-être mis dans le "render" ?)
        req.session.userId = user._id;
        req.session.pseudo = user.pseudo;
        req.session.userStatus = user.status;
        req.session.groupId = group._id;
        req.session.groupName = group.name;

        // notify all the users (may be should use broadcast ?)
        realTime.sockets.in(req.session.groupId).emit('joining', {
          action: 'joining',
          id: req.session.userId,
          pseudo: req.session.pseudo
        });

        displayGroup(req, res, groupId);
      });
  }
}

function closeGroup(req, res) {
  Group.findByIdAndUpdate(req.session.groupId, { $unset: { openedAt: ''}}, function (err, group) {
    console.log('group closed');
    // realTime.sockets.in(req.session.groupId).emit('closing', {

    // req.flash('success', 'Goodbye!');
    req.session.pseudo = null;   // "reset" session
    res.redirect('/');
  });
}

function leaveGroup(req, res) {
  User.findByIdAndRemove(req.session.userId, function () {
    realTime.sockets.in(req.session.groupId).emit('leaving', {
      action: 'leaving',
      id: req.session.userId
    });
    // req.flash('success', 'Goodbye!');
    req.session = null;   // "fin" session
    res.redirect('/');
  });
}

function handleGroup(req, res) {
  // si pas de methode additionnelle (DELETE ou PUT)
  var method = req.query._method || 'POST';

  switch (method) {
  case 'DELETE':
    User.findByIdAndRemove(req.session.userId, function () {
      realTime.sockets.in(req.session.groupId).emit('leaving', {
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


isRefreshed = function (req, res, pseudo) {
  // if pseudo already into session -> already joined/opened -> refresh non supported -> goodbye! :)
  if (pseudo === req.session.pseudo) {
    if (req.user) {
      console.log('already opened!');
      closeGroup(req, res);
    } else {
      console.log('already joined!');
      leaveGroup(req, res);
    }
    return true;
  }
  return false;
}

module.exports = function groupController(app) {
  app.post('/groups/join', joinGroup);
  app.post('/groups/open', openGroup);

  app.post('/groups/:id/leave', leaveGroup);
  app.post('/groups/:id/close', closeGroup);
/*
  // finalement, pas de display direct via GET... On "join" via POST et puis c'est tout !
  // Sinon, on repasse par la case départ :)))
  app.route('/groups/:id')
    // .get(displayGroup)
    .get(function (req, res) {
      req.session = null;
      res.redirect('/');
    })
    .post(handleGroup);
*/
};


/*
Utilisation de 'async' (ancien code, remplacé par Q et ses promises…)

# Note
async permet d'exécuter plusieurs fonctions asynchrones en parallèle et d'effectuer leur callback ensemble, à la fin !

Les méthodes .create(), .findById() ou .exec() (mongoose) peuvent être utilisées avec un callback (optionnel). Sinon, elles renvoient respectivement une <Promise> ou la <query>

Dans notre cas, notre propre méthode .getName(), qui renvoie .exec(), n'utilise pas de callback ! Il n'est donc pas utilisable avec "async" (j'ai pas trouvé)…
Il faut donc "dupliquer" la méthode .getName(), ce qui est un peu bête…

```
getName: function getNameQueue(id) {
  return this
    .findById(id)
    .exec();
}
```
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
