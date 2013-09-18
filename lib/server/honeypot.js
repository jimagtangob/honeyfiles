var config = require('../../config');
var models = require('./models');
var debug = require('debug')('honeyfiles');

exports.addUrls = function(app, callback) {
  var self = this;

  
  app.get(config.uri, function(req, res) {
   
    var id = req.query.q;

    if (config.dummy) {
      // return dummy image
    } else {
      res.end();
    }

    models.Document.find({ where: ["identifier = ?", id] })
    .success(function(document) {

      if (document && document.enabled) {
        document.addHit(req.headers, function(err) {
          if (err) console.error("honeypot add hit got error:", err);
        });
      } else {
        console.error("no document found:", id);
      }
    })
    .error(function(err) {
      console.error("honeypot hit got error:", err);
    });
  });

  callback();

}; 
