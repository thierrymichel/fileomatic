/*jslint browser: true, devel: true, node: true, nomen: true */
'use strict';

/*
 * chargement modules
 */
require('colors'); // les logs en couleurs !

var express = require('express'),
// http = require('http'),
    morgan = require('morgan'), // http request logger (logs auto des requêtes)
    app = express();
// var server = http.createServer(app);

app.set('port', process.env.PORT || 8080);
app.set('view engine', 'jade');

var devMode = 'development' === app.get('env');

app.use(morgan(devMode ? 'dev' : 'common'));
app.use(express.static(__dirname + '/public'));

app.locals.title = 'MisterQ';
app.locals.pretty = devMode;


require('./controllers/home')(app);
require('./controllers/queue')(app);

// server.listen(app.get('port'), function () {
app.listen(app.get('port'), function () {
    console.log('✔︎︎ Express server listening on http://localhost:%d/'.green, app.get('port'), process.versions);
});
