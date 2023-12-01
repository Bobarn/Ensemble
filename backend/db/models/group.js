'use strict';
// const { all } = require('bluebird');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsTo(
        models.User,
        {
          foreignKey: 'organizerId'
        }
      )

      Group.hasMany(
        models.Venue,
        {
          foreignKey: 'groupId',
          onDelete: 'CASCADE',
          hooks: true
        }
      )

      Group.hasMany(
        models.GroupImage,
        {
          foreignKey: 'groupId',
          onDelete: 'CASCADE',
          hooks: true
        }
      )


      Group.hasMany(
        models.Event,
        {
          foreignKey: 'groupId',
          onDelete: 'CASCADE',
          hooks: true
        }
      )

      Group.belongsToMany(
        models.User,
        {
          as: 'Members',
          through: models.Membership,
          foreignKey: 'groupId',
          otherKey: 'userId',
        }
      )


    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 60]
      }
    },
    about: {
      type: DataTypes.TEXT,
      validate: {
        len: [50, 1000]
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        options(value) {
          if(value !== 'In person' && value !== 'Online') {
            throw Error('type must be either "In person" or "Online"')
          }
        }
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    city: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: [1, 50],
      }
    },
    state: {
      allowNull: false,
      type:DataTypes.STRING,
      validate: {
        len: [1, 50]
      }
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
