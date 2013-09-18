var models = require('../lib/server/models');

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

  var filter = {};

  if (req.query.enabled) {
    filter.enabled = true; 
  };

  models.Campaign
   .findAll(filter)
   .success(function(campaigns) { res.send({ status: 'success', campaigns: campaigns })})
   .error(function(err) {
     console.error("unable to list campaigns", err);
      return res.send(500);
   })
};

api.get = function(req, res) {

   models.Campaign
   .find({ id: req.params.id })
   .success(function(campaign) { 
     res.send({ status: 'success', campaign: campaign })
   })
   .error(function(err) {
      console.error("unable to list campaign", err);
      return res.send(500);
   })
};

api.getDocument = function(req, res) {

  models.Document
   .find({ id: req.params.document_id, CampaignId:  req.params.id })
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

  models.Campaign
   .find({ id: req.params.id })
   .success(function(campaign) { 

     if (!campaign) return res.send(404);

     campaign.getDocuments()
     .success(function(documents) {
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

api.downloadDocument = function(req, res) {

  req.connection.setTimeout(60000 * 10);

  models.Document
   .find({ id: req.params.document_id, CampaignId:  req.params.id })
   .success(function(document) { 

     if (!document) return res.send(404);

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
