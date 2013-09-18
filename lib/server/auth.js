var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var models = require('./models');

var setup = function(app) {
  passport.use(new LocalStrategy(function(username, password, done) {
    models.User.authenticate({ username: username, password: password }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(err, false, { message: 'Incorrect username.' });
      }
      return done(null, user);
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    models.User.find({ id: id })
    .success(function(user) {
      done(null, user);
    })
    .error(function(err) { done(err); });
  });

}


exports.required = function(req, res, next) {
  res.locals.user = req.user;
  if (req.user) return next();

  return res.redirect("/login");
};

exports.setup = setup;

exports.logout = function(req, res){
  req.logout();
  res.redirect('/');
};

exports.login =  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login' });

exports.jsonlogin = function(req, res, next) {

  passport.authenticate('local', function(err, user, info) {
   
    if (err) { return next(err); }
    
    if (!user) { 
      return res.json({ status: 'error', message: 'invalid login' });
    }

    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json({ status: 'success', data: { user: user.sanitized() }}); 
    });

  })(req, res, next);
};

