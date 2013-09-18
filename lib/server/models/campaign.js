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

    addDocument: function(options, callback) {
      var self = this; 
      var models = requires('../models');
      options.campaign = self;
      models.Document.add(options, callback);
    }
  };

  var classMethods = {
  };


  Campaign = sequelize.define('Campaign', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
    name: { type: Sequelize.STRING(1024), unique: true, allowNull: false },
    enabled: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  }, {
    classMethods: classMethods,
    instanceMethods: instanceMethods 
  });

  return Campaign;
};
