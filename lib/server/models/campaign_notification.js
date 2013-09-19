var bcrypt = require('bcrypt');
var Sequelize = require('sequelize-sqlite').sequelize;
var files = require('../files');
var util = require('../util');
var mkdirp = require('mkdirp');
var debug = require('debug')('honeyfiles');
var async = require('async');

module.exports = function(sequelize) {

  var CampaignNotification;

  var instanceMethods = {

  };

  var classMethods = {

    add: function(options, callback) {

      CampaignNotification.create({ 
        CampaignId: options.campaign.values.id,
        email: options.email,
        UserId: options.user.values.id,
      })
      .success(function(document) {
        callback(null, document);
      })
      .error(callback);
    }

  };


  CampaignNotification = sequelize.define('CampaignNotification', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
    email: { type: Sequelize.STRING(1024),  allowNull: false },
    enabled: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false },
  }, {
    classMethods: classMethods,
    instanceMethods: instanceMethods 
  });

  return CampaignNotification;
};
