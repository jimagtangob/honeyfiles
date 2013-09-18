
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.get = function(req, res) {
  
};

exports.update = function(req, res) {
  var options = {};
  if (req.body.email) options.email = req.body.email;
};


