

var bcrypt = require('bcrypt');
var Sequelize = require('sequelize-sqlite').sequelize;

module.exports = function(sequelize) {

  var DocumentView;

  var instanceMethods = {
    generate: function() {
    },
  };

  var classMethods = {

  };


  DocumentView = sequelize.define('DocumentView', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
    data: { type: Sequelize.TEXT },
    address: { type: Sequelize.STRING(128) },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  }, {
    classMethods: classMethods,
    instanceMethods: instanceMethods 
  });

  return DocumentView;
};
