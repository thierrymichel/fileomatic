/*jslint node: true, nomen: true, indent: 2 */
'use strict';

var moment = require('moment');
var zeroFill = require('zero-fill');
var _ = require('underscore');

var HELPERS = {
  formatStamp: function formatStamp(date) {
    return moment(date).format('dddd D MMMM à HH:mm');
  },
  formatZero: function formatZero(int) {
    return zeroFill(3, int);
  }
};

function setupHelpers(req, res, next) {
  res.locals.flash = req.flash();

  res.locals.session = req.session;
  res.locals.cookie = req.cookies;

  var lang = _
    .chain(req.acceptsLanguages())    // renvoie un objet encapsulé permettant le chaînage (à la jQuery)
                                      // -> { _wrapped: [ 'fr-FR', 'fr', 'en-US', 'en', 'nl' ], _chain: true }
    .invoke('split', '-')             // invoque une méthode (split) avec args (-) sur chaque él de la collection (objet encapsulé)
                                      // -> { _wrapped: [ [ 'fr', 'FR' ], [ 'fr' ], [ 'en', 'US' ], [ 'en' ], [ 'nl' ] ], _chain: true }
    .pluck(0)                         // .map() avec extraction basée sur une propriété (dans ce cas-ci, index 0)
                                      // -> { _wrapped: [ 'fr', 'fr', 'en', 'en', 'nl' ], _chain: true }
    .uniq()                           // réduit la collection aux éléments uniques
                                      // -> { _wrapped: [ 'fr', 'en', 'nl' ], _chain: true }
    .first()                          // réduit la collection à son premier élément
                                      // -> { _wrapped: 'fr', _chain: true }
    .value();                         // renvoie la valeur de l'objet encapsulé (met fin au chaînage)
                                      // -> fr
  moment.locale(lang);
  _.extend(res.locals, HELPERS);

  next();
}

module.exports = function mainHelpers(app) {
  app.use(setupHelpers);
};
