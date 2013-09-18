var bcrypt = require('bcrypt');
var Sequelize = require('sequelize-sqlite').sequelize;

module.exports = function(sequelize) {

  var User;
  var instanceMethods = {

    auth: function(password) {
      var self = this;
      return bcrypt.compareSync(password, this.password_hash);
    },

    sanitized: function() {
      var self = this;
      return {
        id: this.id,
        email: this.email,
        username: this.username,
        created_at: this.created_at,
        updated_at: this.updated_at
      } 
    }

  };

  var classMethods = {

    authenticate: function(options, callback) {
      User.find({ username: options.username })
      .success(function(user) {
        if (!user) return callback('no user found');
        if (!user.auth(options.password)) return callback ('invalid user');
        return callback(null, user);
      })
      .error(function(err) {
        console.error("[X] Auth error:", error);
        return callback('auth error');
      });
    },

    add: function(options, callback) {

      var salt = bcrypt.genSaltSync();
      var password_hash = bcrypt.hashSync(options.password, salt);

      if (!options.username) return callback('Username is required');

      var make = function() {
        User.create({
          password_hash: password_hash,
          username: options.username,
          email: options.email,
        })
        .success(function(user) {
          callback(null, user);
        })
        .error(function(err) {
          callback(err);
        }) 
      };

      User.find({ username: options.username })
      .success(function(user) {
        if (user) return callback('User already exists: ' + options.username);
        make();
      })
      .error(function(err) {
        callback(err); 
      });
    }
  };


  User = sequelize.define('User', {
    id: {
      type: Sequelize.INTEGER, 
      autoIncrement: true, 
      allowNull: false, 
      primaryKey: true
    },
    username: { type: Sequelize.STRING(512), unique: true, allowNull: false },
    email: { type: Sequelize.STRING(1024), allowNull: false }, 
    enabled: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false },
    password_hash: { type: Sequelize.STRING(255), allowNull: false },
  }, {
    classMethods: classMethods,
    instanceMethods: instanceMethods 
  });



  return User;

};

