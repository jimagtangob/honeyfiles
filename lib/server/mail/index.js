var nodemailer = require('nodemailer');
var config = require('../config');
var debug = require('debug')('honeyfiles');


function Notify(options) {
  var self = this;
  if (!options['host']) {
    console.log("warning: no email host setup! mail notifications will be disabled.")
    return;
  }

  if (!options['from']) {
    console.log("warning: no email from setup! mail notifications will be disabled.")
    return;
  }

  self.from = options.from;

  self.mailer = nodemailer.createTransport("SMTP", {
      host: options.host, 
      secureConnection: options.secure, // use SSL
      port: options.port, // port for secure SMTP
      auth: {
              user: options.user, 
              pass: options.password 
          }
  });
};

Notify.prototype.send = function(dst, data) {
  var self = this;
  if (!self.mailer) return;
  debug('sending to', dst.email);

  var subject = "New hit on document in campaign: {{campaign.name}} from {{hit.from}}"


};

var smtpTransport = nodemailer.createTransport("SMTP",{
    auth: {
        user: "gmail.user@gmail.com",
        pass: "userpass"
    }
});

exports.notify = function(dst, data) {

  if (!exports._notify) {
    
    var options = {
      host: config.get('email.host'),
      from: config.get('email.from'),
      secure: config.get('email.secure'),
      port: config.get('email.port'),
      user: config.get('email.auth.user'),
      password: config.get('email.auth.password'),
    };

    exports._notify = new Notify(options);
  }

  exports._notify.send(dst, data);


} 
