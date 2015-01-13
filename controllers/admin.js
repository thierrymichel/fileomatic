/*jslint node: true, indent: 2 */
'use strict';

/*
 * Admin controller
 */

var Group = require('../models/group');

function listGroups(req, res) {
  Group
    .getAll()
    .then(function (groups) {
      res.render('admin', {groups: groups});
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
      req.flash('success', 'Group "' + group.name + '" added!');
      res.redirect('/admin/groups');
    });
}

function manageGroup(req, res) {
  if (req.query._method === 'DELETE') {
    Group.findByIdAndRemove(req.params.id, function () {
      req.flash('success', 'Group "#' + req.params.id + '" deleted!');
      res.redirect('/admin/groups');
    });
  }
}

module.exports = function adminController(app) {
  app.get('/admin', function (req, res) {
    res.redirect('/admin/groups');
  });
  app.route('/admin/groups')
    .get(listGroups)
    .post(createGroup);
  app.get('/admin/groups/:id', manageGroup); // should be POST…
};
