/*jslint node: true, indent: 2, nomen: true */
'use strict';



/*
 * chargement modules
 */

require('colors'); // les logs en couleurs !

var bodyParser  = require('body-parser');     // permet de récupérer le 'body' de la 'request' au format json
var cookieParser  = require('cookie-parser');  // gestion sessions via cookies
var cookieSession = require('cookie-session');  // gestion sessions via cookies
var express       = require('express');         // main application framework
var flash         = require('connect-flash');   // système de message 'flash' (via session)
var http          = require('http');            // interface http (client/serveur)
var morgan        = require('morgan');          // http request logger (logs automatique des requêtes)
var path          = require('path');            // gestion des chemins
var serveStatic   = require('serve-static');    // routage auto pour fichiers statiques
var util          = require('util');            // utilitaires divers

var app           = express();
var server        = http.createServer(app);



/*
 * Settings
 */

var devMode = 'development' === app.get('env');

app.set('port', process.env.PORT || 8080);
app.set('view engine', 'jade');

app.locals.title = 'MisterQ';
app.locals.pretty = devMode;



/*
 * init
 */

app.use(morgan(devMode ? 'dev' : 'common'));
app.use(cookieParser('misterq:pseudo'));
app.use(cookieSession({ name: 'misterq:session', secret: "7cd2163777f65b9df981952fbe4e1159" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(serveStatic(path.join(__dirname, 'public')));
app.use(serveStatic(path.join(__dirname, 'bower_components')));

require('./helpers/main')(app);
require('./controllers/home')(app);
require('./controllers/groups')(app);
require('./controllers/users')(app);
require('./controllers/admin')(app);
require('./controllers/web-sockets')(server);

require('./models/connection')(function () {
  console.log('✔︎ Connected to mongoDB database'.green);

  server.listen(app.get('port'), function () {
    var msg = util.format('✔︎︎ Express server listening on http://localhost:%d/', app.get('port'));
    console.log(msg.green);
  });
});
