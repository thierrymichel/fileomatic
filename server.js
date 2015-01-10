/*jslint node: true, indent: 2, nomen: true */
'use strict';



/*
 * chargement modules
 */

require('colors'); // les logs en couleurs !

var bodyParser  = require('body-parser'),     // permet de récupérer le 'body' de la 'request' au format json
  cookieSession = require('cookie-session'),  // gestion … cookies/sessions ;P
  express       = require('express'),         // main application framework
  flash         = require('connect-flash'),   // système de message 'flash' (via session)
  http          = require('http'),            // interface http (client/serveur)
  morgan        = require('morgan'),          // http request logger (logs automatique des requêtes)
  path          = require('path'),            // gestion des chemins
  serveStatic   = require('serve-static'),    // routage auto pour fichiers statiques
  util          = require('util'),            // utilitaires divers

  app           = express(),
  server        = http.createServer(app);



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
app.use(cookieSession({ name: 'misterq:session', secret: "7cd2163777f65b9df981952fbe4e1159" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(serveStatic(path.join(__dirname, 'public')));
app.use(serveStatic(path.join(__dirname, 'bower_components')));

require('./helpers/main')(app);
require('./controllers/home')(app);
require('./controllers/queues')(app);
require('./controllers/admin')(app);
require('./controllers/web-sockets')(server);

require('./models/connection')(function () {
  console.log('✔︎ Connected to mongoDB database'.green);

  server.listen(app.get('port'), function () {
    var msg = util.format('✔︎︎ Express server listening on http://localhost:%d/', app.get('port'));
    console.log(msg.green);
  });
});
