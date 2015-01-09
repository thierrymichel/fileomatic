/*jslint node: true, indent: 2 */
'use strict';

/*
 * Admin controller
 */

var Queue = require('../models/queue');

function listQueues(req, res) {
  Queue
    .getAll()
    .then(function (queues) {
      res.render('admin', {queues: queues});
    });
}

function createQueue(req, res) {
  Queue
    .create({
      name: req.body.name,
      description: req.body.description
    })
    .then(function (queue) {
      // console.log('Added : ' + queue.name);
      req.flash('success', 'Queue "' + queue.name + '" added!');
      res.redirect('/admin/queues');
    });
}

function manageQueue(req, res) {
  if (req.query._method === 'delete') {
    Queue.findByIdAndRemove(req.params.id, function () {
      req.flash('success', 'Queue "#' + req.params.id + '" deleted!');
      res.redirect('/admin/queues');
    });
  }
}

module.exports = function adminController(app) {
  app.get('/admin', function (req, res) {
    res.redirect('/admin/queues');
  });
  app.route('/admin/queues')
    .get(listQueues)
    .post(createQueue);
  app.get('/admin/queues/:id', manageQueue); // should be via post method...
};
