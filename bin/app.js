
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('../routes')
  , user = require('../routes/user')
  , http = require('http')
  , path = require('path')
  , config = require('../config')
  , server = require('../lib/server')
  , exphbs  = require('express3-handlebars')
  , helpers = require('../lib/helpers');

var passport = require('passport');
var app = express();
var hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: helpers
});

// all environments
app.set('port', process.env.PORT || 3000);
// app.set('views', __dirname + '../views');
// app.set('view engine', 'ejs');
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: 'afsjljX)FJfejejneX' }));  // XXX: not hardcoded
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public/'));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', server.auth.required, routes.index);
app.get('/login', routes.login);
app.get('/users', user.list);

app.get('/campaigns', server.auth.required, routes.campaign.index);
app.get('/campaigns/:id', server.auth.required, routes.campaign.get);


// app.get('/api/campaigns/testCreate', server.auth.required, routes.campaign.api.testCreate);
// app.get('/api/campaigns/:id/testCreateDocument', server.auth.required, routes.campaign.api.testCreateDocument);
app.get('/api/campaigns', server.auth.required, routes.campaign.api.list);
app.get('/api/campaigns/:id', server.auth.required, routes.campaign.api.get);
app.post('/api/campaigns', server.auth.required, routes.campaign.api.create);
app.post('/api/campaigns/:id/documents', server.auth.required, routes.campaign.api.createDocument);
app.get('/api/campaigns/:id/documents', server.auth.required, routes.campaign.api.listDocuments);
app.get('/api/campaigns/:id/documents/:document_id', server.auth.required, routes.campaign.api.getDocument);
app.get('/api/campaigns/:id/documents/:document_id/views', server.auth.required, routes.document.api.listDocumentViews);
app.get('/api/campaigns/:id/documents/:document_id/download', server.auth.required, routes.campaign.api.downloadDocument);

app.get('/fetch/ip', function(req, res) {
  var ip_address = null;
  if(req.headers['x-forwarded-for']){
    ip_address = req.headers['x-forwarded-for'];
  } else {
    ip_address = req.connection.remoteAddress;
  };

  res.json({
    ip: ip_address
  });
});

app.post('/login', server.auth.login);

server.auth.setup(app);
server.honeypot.addUrls(app, function() {

  http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });

});


