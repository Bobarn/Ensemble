'use strict';

/** @type {import('sequelize-cli').Migration} */

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        firstName: 'Demo',
        lastName: 'Lition',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user1@user.io',
        firstName: 'Faker',
        lastName: 'User',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'user2@user.io',
        firstName: 'Fakerer',
        lastName: 'Userdos',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'amigo@user.io',
        firstName: 'Amos',
        lastName: 'Famous',
        username: 'Cookies',
        hashedPassword: bcrypt.hashSync('FamousC')
      },
      {
        email: 'tango@user.io',
        firstName: 'Tanner',
        lastName: 'Owens',
        username: 'TanGOAT',
        hashedPassword: bcrypt.hashSync('Chacha')
      },
      {
        email: 'Edd@user.io',
        firstName: 'Edd',
        lastName: 'Jenkins',
        username: 'DoubleDee',
        hashedPassword: bcrypt.hashSync('CNetwork')
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
