/*jslint node: true, indent: 2 */
'use strict';

function setupHelpers(req, res, next) {
  res.locals.flash = req.flash();
  next();
}

function setupSessionInfos(req, res, next) {
  res.locals.session = req.session;
  next();
}

module.exports = function mainHelpers(app) {
  app.use(setupHelpers);
  app.use(setupSessionInfos);
};
