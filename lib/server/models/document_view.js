

var bcrypt = require('bcrypt');
var Sequelize = require('sequelize-sqlite').sequelize;

module.exports = function(sequelize) {

  var DocumentView;

  var instanceMethods = {
  };

  var classMethods = {

    add: function(options, callback) {
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
