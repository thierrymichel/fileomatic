/*jslint node: true, nomen: true, indent: 2 */
'use strict';

/*
 * Admin controller
 */

var passport =      require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Group =         require('../models/group');
var Admin =         require('../models/admin');
var bCrypt =        require('bcrypt');

function login(req, res) {
  res.render('login');
}

function logout(req, res) {
  req.logout();
  req.flash('success', 'Tu as bien été déconnecté(e) !');
  res.redirect('/');
}

function isValidPassword(password, admin) {
  return bCrypt.compareSync(password, admin.password);
}

function listGroups(req, res) {
  Group
    .getAll()
    .then(function (groups) {
      res.render('admin', { groups: groups });
    });
}

function createGroup(req, res) {
  Group
    .create({
      name: req.body.name,
      description: req.body.description
    })
    .then(function (group) {
      // console.log('Added : ' + group.name);
      req.flash('success', 'Groupe "' + group.name + '" ajouté !');
      res.redirect('/admin/groups');
    });
}

function manageGroup(req, res) {
  if (req.query._method === 'DELETE') {
    Group.findByIdAndRemove(req.params.id, function () {
      req.flash('success', 'Groupe "#' + req.params.id + '" effacé !');
      res.redirect('/admin/groups');
    });
  }
}

// Stratégie locale (appelée aussi 'login' :)

passport.use('login', new LocalStrategy({
  usernameField:      'email',
  passwordField:      'password',
  passReqToCallback : true
}, function (req, email, password, done) {
  Admin.findOne({ email: email },
    function (err, admin) {
      if (err) {
        return done(err);
      }
      // User does not exist
      if (!admin) {
        console.log('Admin not found with email ' + email);
        return done(null, false, req.flash('alert', 'Utilisateur inconnu !'));
      }
      // User exists but wrong password
      if (!isValidPassword(password, admin)) {
        console.log('Admin invalid Password');
        return done(null, false, req.flash('alert', 'Mot de passe incorrect !'));
      }
      // everything is fine!
      return done(null, admin);
    });
}));

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  Admin.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = function adminController(app) {
  app.use('/admin', function (req, res, next) {
    if (req.user) {
      return next();
    }
    req.flash('info', 'Tu dois être authentifié(e) !');
    res.redirect('/login');
  });
  app.use('/login', function (req, res, next) {
    app.locals.isAdmin = (req.user) ? true : false;
    return next();
  });
  app.route('/login')
    .get(login)
    .post(passport.authenticate('login', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    }));
  app.get('/logout', logout);
  // app.get('/admin', function (req, res) {
  //   res.redirect('/admin/login');
  // });
  app.route('/admin/groups')
    .get(listGroups)
    .post(createGroup);
  app.get('/admin/groups/:id', manageGroup); // should be POST…
  // add an admin manualy
  // app.get('/createadmin', function (req, res) {
  //   Admin
  //     .create({
  //       username: 'username',
  //       email: 'email',
  //       password: bCrypt.hashSync('password', 8)
  //     })
  //     .then(function (admin) {
  //       req.flash('success', 'Admin "' + admin.username + '" added!');
  //       res.redirect('/');
  //     });
  // });
};
