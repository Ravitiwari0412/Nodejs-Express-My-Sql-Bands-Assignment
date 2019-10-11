'use strict';

module.exports = (sequelize, Sequelize) => {

  const Bands = sequelize.define('Bands', {

    name: Sequelize.STRING,

    artist: Sequelize.STRING,

    userId: Sequelize.STRING

  }, {});

  Bands.associate = function(models) {

    // associations can be defined here

    Bands.belongsTo(models.Users,

      {foreignKey: 'userId'}

      );

    

  };

  return Bands;

};