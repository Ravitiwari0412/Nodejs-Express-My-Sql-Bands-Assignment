'use strict';

var bcrypt = require("bcryptjs");



module.exports = (sequelize, Sequelize) => {

  const Users = sequelize.define('Users', {

    name: Sequelize.STRING,

    company: Sequelize.STRING,

    dob: Sequelize.DATE,

    email: Sequelize.STRING,

    password: Sequelize.STRING,
    
   

  }, {});

  Users.associate = function(models) {

    // associations can be defined here

    Users.hasMany(models.Bands , {

      foreignKey: 'id'

    });

  };

  

Users.prototype.validPassword = function(password) {

  return bcrypt.compareSync(password, this.password);

};

Users.beforeCreate(user => {

  user.password = bcrypt.hashSync(

    user.password,

     bcrypt.genSaltSync(10),

     null

   );

 });

 return Users;

};