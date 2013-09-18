var geoip = require('geoip-lite');
var Sequelize = require('sequelize-sqlite').sequelize;

module.exports = function(sequelize) {

  var DocumentView;

  var instanceMethods = {

    location: function() {
      var self = this;
      return geoip.lookup(self.from);
    }
  };

  var classMethods = {

    add: function(options, callback) {

      var end = new Date();
      var start = new Date(end.getTime() - 1000);

      DocumentView.find({ 
        from: options.data.from, useragent: options.data['user-agent'],
        where: ['createdAt <= ? and createdAt >= ?', end, start]
      })
      .success(function(i) {

        if (i) {
          return callback();
        }

        DocumentView.create({
          DocumentId: options.document.values.id,
          from: options.data.from,
          useragent: options.data['user-agent'],
          data: JSON.stringify(options.data)
        })
        .success(function(documentview) {
          callback(null, documentview);
        })
        .error(callback);
     
      })
      .error(callback);
    }
   
  };

  DocumentView = sequelize.define('DocumentView', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
    from: { type: Sequelize.STRING },
    useragent: { type: Sequelize.STRING(2048) },
    data: { type: Sequelize.TEXT },
  }, {
    classMethods: classMethods,
    instanceMethods: instanceMethods 
  });

  return DocumentView;
};
