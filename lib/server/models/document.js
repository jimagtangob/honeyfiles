var files = require('../files');
var bcrypt = require('bcrypt');
var Sequelize = require('sequelize-sqlite').sequelize;
var util = require('../util');
var mkdirp = require('mkdirp');
var config = require('../../../config');
var debug = require('debug')('honeyfiles');
var uuid = require('node-uuid');


module.exports = function(sequelize) {

  var Document;

  var instanceMethods = {

    download: function(callback) {
      var self = this;

      var options = {
        id: self.identifier,
        variables: {
          "{{TEMPLATEURL}}": config.url + config.uri + "?q=" + self.identifier
        }   
      };

      debug('generating doc:', self.type, options);

      var doc = new files[self.type](options);
      doc.on('error', callback)
      doc.on('done', function(data) {
        var dst = path.join(__dirname, '../../../var', self.identifier);
        fs.writeFile(dst, data, function(err) {
          if (err) return callback(err);
          callback(null, data);
        });
      });
      doc.run();
    }
  };

  var classMethods = {

    add: function(options, callback) {

      if (!files[options.type]) return callback('type is not supported:' + type);

      var identifier = uuid.v4(); 
      Document.create({ 
        campaignId: options.campaign.id,
        identifier: identifier,
        type: options.type,
        name: options.name,
      })
      .success(function(document) {
        callback(null, document);
      })
      .error(callback);
    }


  };


  Document = sequelize.define('Document', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
    identifier: { type: Sequelize.STRING(2048), unique: true, allowNull: false },
    name: { type: Sequelize.STRING(1024), unique: true, allowNull: false },
    type: { type: Sequelize.STRING(20), unique: true, allowNull: false },
    enabled: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  }, {
    classMethods: classMethods,
    instanceMethods: instanceMethods 
  });

  return Document;
};
