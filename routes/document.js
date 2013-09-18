
var models = require('../lib/server/models');

var api = {};

api.listDocumentViews = function(req, res) {

  models.Document
  .find({ where: ['id = ? and CampaignId = ?', req.params.document_id, req.params.id ] })
   .success(function(document) { 

     if (!document) return res.send(404);

     document.hits(function(err, data) {
    
       if (err) {
         console.error("error fetching document views", err);
         res.send(500);
       }
     
       res.send({ status: 'success', document_views: data })
     });
   })
   .error(function(err) {
      console.error("unable to fetch document views", err);
      return res.send(500);
   });

};

exports.api = api;
