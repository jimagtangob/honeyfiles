var config = require('./config');
var models = require('./models');
var debug = require('debug')('honeyfiles');


function notify(document, hit) {

  document.getCampaign()
  .success(function(campaign) {
 
    if (campaign) {
      campaign.getCampaignNotifications()
      .success(function(notifications) {
     
        _.each(notifications, function(notify) {

          if (notify.email) {
            console.log("XXX NOTIFYING", notify);
          }
        
        
        });
      })
      .error(function(err) {
        console.error("notification error:", err);
      });
    }
  })
  .error(function(err) { console.error("notification error:", err);})

};

exports.addUrls = function(app, callback) {
  var self = this;

  var uri = config.get('uri');

  if (!uri) {
    console.error("Missing `uri` value in config.");
    process.exit(1);
  };

  app.get(uri, function(req, res) {

    var id = req.query.q;

    if (config.get('dummy')) {
      // return dummy image
    } else {
      // return empty data
      res.end();
    }

    models.Document.find({ where: ["identifier = ?", id] })
    .success(function(document) {

      if (document && document.enabled) {

        var data = req.headers;
        if(req.headers['x-forwarded-for']){
          ip_address = req.headers['x-forwarded-for'];
        } else {
          ip_address = req.connection.remoteAddress;
        };

        data.from = ip_address;

        document.addHit(data, function(err, hit) {
          if (err) console.error("honeypot add hit got error:", err);
          notify(document, hit);
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
