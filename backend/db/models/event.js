'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.hasMany(
        models.EventImage,
        {
          foreignKey: 'eventId',
          onDelete: 'CASCADE',
          hooks: true
        }
      )

      Event.belongsToMany(
        models.User,
        {
          through: models.Attendance,
          foreignKey: 'eventId',
          otherKey: 'userId',
        }
      )

      Event.belongsTo(
        models.Group,
        {
          foreignKey: 'groupId'
        }
      )

      Event.belongsTo(
        models.Venue,
        {
          foreignKey: 'venueId',
          onDelete: 'SET NULL'
        }
      )
    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
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
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate:{
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Event',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'capacity', 'price', 'description']
      }
    },
    scopes: {
      specific: {
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      }
    }
  });
  return Event;
};
