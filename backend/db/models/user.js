'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(
        models.Group,
        {
          foreignKey: 'organizerId',
          onDelete: 'CASCADE',
          hooks: true
        }
      )

      User.belongsToMany(
        models.Group,
        {
          as: 'Orgs',
          through: models.Membership,
          foreignKey: 'userId',
          otherKey: 'groupId'
        }
      )

      User.belongsToMany(
        models.Event,
        {
          through: models.Attendance,
          foreignKey: 'userId',
          otherKey: 'eventId',
        }
      )
    }
  };

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [0, 30],
          isAlpha: true
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [0, 30],
          isAlpha: true
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      },
      scopes: {
        specific: {
          exclude: ['username']
        }
      }
    }
  );
  return User;
};
