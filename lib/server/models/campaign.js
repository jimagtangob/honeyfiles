var bcrypt = require('bcrypt');
var Sequelize = require('sequelize-sqlite').sequelize;
var files = require('../files');
var util = require('../util');
var mkdirp = require('mkdirp');
var config = require('../../../config');
var debug = require('debug')('honeyfiles');

module.exports = function(sequelize) {

  var Campaign;

  var instanceMethods = {

    createDocument: function(options, callback) {
      var self = this; 
      var models = require('../models');
      options.campaign = self;
      models.Document.add(options, callback);
    }
  };

  var classMethods = {
  };


  Campaign = sequelize.define('Campaign', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
    name: { type: Sequelize.STRING(1024),  allowNull: false },
    enabled: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false },
  }, {
    classMethods: classMethods,
    instanceMethods: instanceMethods 
  });

  return Campaign;
};
