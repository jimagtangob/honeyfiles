
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('../routes')
  , user = require('../routes/user')
  , http = require('http')
  , path = require('path')
  , config = require('../config')
  , server = require('../lib/server');

var passport = require('passport');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '../views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use( express.cookieParser() );
app.use(express.session({ secret: 'afsjljX)FJfejejneX' }));  // XXX: not hardcoded
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

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
app.get('/login', server.auth.login);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

server.auth.setup();
