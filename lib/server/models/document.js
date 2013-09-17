

var bcrypt = require('bcrypt');
var Sequelize = require('sequelize-sqlite').sequelize;

module.exports = function(sequelize) {

  var Document;

  var instanceMethods = {
    generate: function() {
    },
  };

  var classMethods = {

  };


  Document = sequelize.define('Document', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
    identifier: { type: Sequelize.STRING(2048), unique: true, allowNull: false },
    name: { type: Sequelize.STRING(1024), unique: true, allowNull: false },
    enabled: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  }, {
    classMethods: classMethods,
    instanceMethods: instanceMethods 
  });

  return Document;
};
