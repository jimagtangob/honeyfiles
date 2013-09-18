var files = require('../files');
var bcrypt = require('bcrypt');
var Sequelize = require('sequelize-sqlite').sequelize;
var util = require('../util');
var mkdirp = require('mkdirp');
var debug = require('debug')('honeyfiles');
var async = require('async');
var uuid = require('node-uuid');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');

module.exports = function(sequelize) {

  var Setting;

  var instanceMethods = {

  };

  var classMethods = {

    setup: function(callback) {
      var items = [ 
        { key: 'uri', type: 'string', value: '/files', description: 'uri for getting images.  default: /files'},
        { key: 'host', type: 'string', value: 'http://localhost:3000', description: 'base url.  default: http://localhost:3000'},
        { key: 'email.from', type: 'string', value: '', description: 'email from, e.g. bob@example.com'},
        { key: 'email.host', type: 'string', value: '', description: 'email host, e.g. smtp.gmail.com'},
        { key: 'email.secure', type: 'boolean', value: '', description: 'use ssl (true or false)'},
        { key: 'email.port', type: 'integer', value: '', description: 'email port'},
        { key: 'email.auth.user', type: 'string', value: '', description: 'email auth user'},
        { key: 'email.auth.password', type: 'string', value: '', description: 'email auth password'},
        // { key: 'smtp', type: 'json', value: '', description: 'email smtp settings'},
      ];

      async.each(items, function(item, cb) {
        
        Setting.findOrCreate({ key: item.key }, item)
        .success(function(item) {
          cb();
        })
        .error(cb);

      }, callback);
    
    }
  };

  Setting = sequelize.define('Setting', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
    key: { type: Sequelize.STRING(2048), unique: true, allowNull: false },
    value: { type: Sequelize.STRING(2048), allowNull: false },
    description: { type: Sequelize.STRING(2048),  allowNull: false },
    type: { type: Sequelize.STRING(20),  allowNull: false },
  }, {
    classMethods: classMethods,
    instanceMethods: instanceMethods 
  });

  return Setting;
};
