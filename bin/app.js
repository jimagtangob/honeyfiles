
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('../routes')
  , user = require('../routes/user')
  , http = require('http')
  , path = require('path')
  , exphbs  = require('express3-handlebars');

var app = express();
var hbs = exphbs.create({
  defaultLayout: 'main'
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
app.use(app.router);
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public/'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){
  res.render('login', { title: 'Express' });
});
app.get('/users', user.list);

app.get("/fetch/ip", function(req, res) {
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


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
