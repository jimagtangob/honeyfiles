var bcrypt = require('bcrypt');
var Sequelize = require('sequelize-sqlite').sequelize;
var files = require('../files');
var util = require('../util');
var mkdirp = require('mkdirp');
var debug = require('debug')('honeyfiles');
var async = require('async');

module.exports = function(sequelize) {

  var Campaign;

  var instanceMethods = {

    /**
     * Create a new document for this campaign.
     */
    createDocument: function(options, callback) {
      var self = this; 
      var models = require('../models');
      options.campaign = self;
      models.Document.add(options, callback);
    },

    /**
     * Get stats for all downloaded docs.
     */
    stats: function(callback) {
      var self = this;
      var result = {
        document_hits: 0,
        total_hits: 0,
        total_documents: 0
      };

      self.getDocuments()
      .success(function(docs) {

        result.total_documents = docs.length;

        async.each(docs, function(doc, cb) {
          
          doc.stats(function(err,data) {
            if (err) return cb(err);
            if (data.hits) result.document_hits += 1;
            result.total_hits += result.document_hits; 
            cb();
          });

        }, function(err) {
          callback(err, result)
        })
       })
      .error(callback);

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
