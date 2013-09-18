var models = require('../lib/server/models');
var async = require('async');
var _ = require('underscore');

function get(req, res, next) {

   models.Campaign
   .find({ id: req.params.id })
   .success(function(campaign) { 
     
     if (!campaign) return res.send(404);
     if (next) return next(campaign);
     res.send({ status: 'success', campaign: campaign })
   })
   .error(function(err) {
      console.error("unable to list campaign", err);
      return res.send(500);
   })

}
function create(options, callback) {

  if (!options.name) 
    return callback('name is required');

  if (!options.user) 
    return callback('user is required');

  models.Campaign.create({
    name: options.name
  })
  .success(function(campaign) {
    callback(null, campaign); 
  })
  .error(callback);
};

function list(req, res, next) {

  var filter = {};

  if (req.query.enabled) {
    filter.enabled = true; 
  };

  models.Campaign
   .findAll(filter)
   .success(function(campaigns) { 

     var result = [];

     async.each(campaigns, function(campaign, cb) {
        campaign.stats(function(err, stats) {
          if (err) return cb(err);
          var v = campaign.values;
          v.stats = stats;
          result.push(v)
          cb();
        });
     }, function(err) {
       if (next) { return next(result); }
       res.send({ status: 'success', campaigns: result });
     })
   })
   .error(function(err) {
     console.error("unable to list campaigns", err);
      return res.send(500);
   })
};

function listDocuments(req, res, next) {

  models.Campaign
  .find({ id: req.params.id })
  .success(function(campaign) { 

    if (!campaign) {
     console.error("no campaign found", req.params.id);
     return res.send(404);
    }

    campaign.getDocuments()
    .success(function(documents) {
      if (next) return next(campaign, documents);
      res.send({ status: 'success', documents: documents })
    })
    .error(function(err) { 
      console.error("unable to list documents", err);
      return res.send(500);
    });
   })
   .error(function(err) {
      console.error("unable to fetch campaign", err);
      return res.send(500);
   });
};


var api = {};

api.create = function(req, res) {

  var options = {};
  options.name = req.body.name; 
  options.user = req.user;

  create(options, function(err, campaign) {
    if (err) {
      console.error("campaign creation error:", err);
      return res.send(500);
    }

    if (!campaign) {
      console.error("no campaign created") ;
      return res.send(500);
    }

    return res.send({ status: 'success', campaign: campaign })
  });

};

api.list = function(req, res) {
  list(req, res);
};

api.get = function(req, res) {
  get(req, res);
};

api.getDocument = function(req, res) {

  models.Document
   .find({ where: ['id = ? and CampaignId = ?', req.params.document_id, req.params.id ] })
   .success(function(document) { 

     if (!document) return res.send(404);

     res.send({ status: 'success', document: document })
   })
   .error(function(err) {
      console.error("unable to fetch campaign", err);
      return res.send(500);
   });

};


api.listDocuments = function(req, res) {

  return listDocuments(req, res);
};

api.downloadDocument = function(req, res) {

  req.connection.setTimeout(60000 * 10);

  models.Document
   .find({ where: ['id = ? and CampaignId = ?', req.params.document_id, req.params.id ] })
   .success(function(document) { 

     if (!document) return res.send(404);

     console.log("XXX FOUND", document.values)

     document.download(function(err, data) {

       if (err || !data) {
        console.error("download failed", err);
        return res.send(500);
       } 

       var filename = document.name;
       res.setHeader('Content-disposition', 'attachment; filename=' + filename);
       res.writeHead(200, { 'Content-Type': 'application-octet-stream',
                     'Set-Cookie': 'fileDownload=true; path=/'
       });

       res.write(data);
       res.end();
     })

   })
   .error(function(err) {
      console.error("unable to fetch campaign", err);
      return res.send(500);
   });


};

api.createDocument = function(req, res) {

  var type = req.body.type || req.query.type;
  var name = req.body.name || req.query.name;

  if (!type) return res.send(500, 'type is required');

  var options = {
    type: type,
    name: name
  };

  models.Campaign
   .find({ id: req.params.id })
   .success(function(campaign) { 

     if (!campaign) return res.send(404);

     campaign.createDocument(options, function(err, document) {
       if (err) {
         console.error("unable to create document", err);
         return res.send(500);
       }
     
       res.send({ status: 'success', document: document })
     });
   })
   .error(function(err) {
      console.error("unable to create document", err);
      return res.send(500);
   });

};


api.testCreate = function(req, res) {
  req.body.name = 'test comp';
  exports.api.create(req, res);
}

api.testCreateDocument = function(req, res) {
  exports.api.createDocument(req, res);
}

exports.api = api;


exports.create = function(req, res) {
  res.render('new-campaign', {
    title: 'Create a Campaign'
  });
};

exports.doCreate = function(req, res) {

  var options = {};
  options.name = req.body.name; 
  options.user = req.user;

  create(options, function(err) {
    if (err) return res.send(500, err); // TODO: show erros 
    res.redirect("/campaigns");
  })
};

exports.index = function(req, res) {
  list(req, res, function(campaigns) {
    res.render('campaigns', {
      title: '',
      campaigns: campaigns
    });
  });
};

exports.new = function(req, res) {
  res.render('new-campaign', {
    title: ''
  }); 
};



exports.get = function(req, res) {
  listDocuments(req, res, function(campaign, documents) {
    campaign.stats(function(err, stats) {
      
      if (err) {
        console.error("error getting campaign", err);
        return res.send(500);
      };

      campaign = campaign.values;

      campaign.stats = stats;

      res.render('view-campaign', {
        title: '',
        campaign: campaign,
        documents: documents
      }); 
    })
   
  });
};





