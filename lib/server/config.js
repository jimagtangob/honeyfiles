var models = require('./models');
var _ = require('underscore');
var async = require('async');

function Config() {
  this.items = {};
};
require('util').inherits(Config, require('events').EventEmitter);

Config.prototype.get = function(key) {
  
  var v = this.items[key];
  if (!v) return v;

  switch (v.type) {

    case 'bool':
      case 'boolean':
      return Boolean(v.value);
    case 'integer':
      return parseInt(v.value);
    case 'json':
      return JSON.parse(v.value);
  } 

  return v.value;
}

Config.prototype.update = function(item) {
  if (this.items[item.key]) {
    switch (this.items[item.key].type) {
      case 'json':
        this.items[item.key].value = JSON.stringify(item.value);
      break;
      default: 
        this.items[item.key].value = item.value.toString();
    }
  } else {
    throw 'invalid key';
  };

  this.save();
};


Config.prototype.save = function(callback) {

  var values = _.values(this.items)
  async.each(values, function(i, cb) {

    models.Setting.update({ value: i.value }, { key: i.key })
    .success(function(found) {
      cb();
    })
    .error(cb);
  }, function(err) {

    if (callback) callback(err);
  });

};

Config.prototype.load = function() {

  var self = this;

  models.Setting.setup(function(err) {
   
    if (err) self.emit('error', err);

    models.Setting.findAll()
    .success(function(items) {

      _.each(items, function(item) {
        self.items[item.key] = item.values; 
      });

      self.emit('ready');
    })
    .error(function(err) {
      self.emit('error', err);
    })


  })

}

config = new Config();

module.exports = config;



