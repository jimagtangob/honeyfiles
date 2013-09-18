
var models = require('../lib/server/models');

var api = {};


api.listDocumentViews = function(req, res) {

  var id = req.params.id;
  var document_id = req.params.document_id;

  models.Document
   .find({ id: document_id, CampaignId:  id })
   .success(function(document) { 

     if (!document) return res.send(404);

     document.getDocumentViews()
     .success(function(data) {
       res.send({ status: 'success', document_views: data })
     })
     .error(function(err) {
       console.error("error fetching document views", err);
       res.send(500);
     })

   })
   .error(function(err) {
      console.error("unable to fetch document views", err);
      return res.send(500);
   });

};

exports.api = api;
