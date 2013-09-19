var config = require('../lib/server/config');

function update(req, res, next) {

  var key = req.body.key;
  var value = req.body.value;

  try {
    config.update({
      key: key, 
      value: value
    });
  } catch (err) {
    return res.send('500', err);
  }
 
  if (next) return next(config.items);
  return res.send({ status: 'success', settings: config.items });
};

function list(req, res, next) {
  if (next) return next(config.items);
  return res.send({ status: 'success', settings: config.items });
};

var api = {};
exports.api = api;

api.update = function(req, res) {
  update(req, res);
};
api.list = function(req, res) {
  list(req, res);
};


exports.api = api;

exports.index = function(req, res) {
  res.render('settings', {
    title: ''
  });
};

