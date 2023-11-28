'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Group } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   options.tableName = 'Groups';

    return await Group.bulkCreate([
      {
        organizerId: 1,
        name: 'GroupOne',
        about: 'A casual business group looking to have fun with other winners and talk business!',
        type: 'placeholder',
        private: false,
        city: 'San Diego',
        state: 'California'
      },
      {
        organizerId: 2,
        name: 'GroupTwo',
        about: 'A casual science group looking to have fun with other geeks and talk science',
        type: 'placeholder',
        private: false,
        city: 'San Francisco',
        state: 'California'
      },
      {
        organizerId: 3,
        name: 'GroupThree',
        about: 'A casual business group looking to have fun with other winners and talk business!',
        type: 'filler',
        private: false,
        city: 'Jacksonville',
        state: 'Florida'
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Groups'

    const Op = Sequelize.Op;

    return await queryInterface.bulkDelete(options, {

        id: {
          [Op.in]: [1, 2, 3]
        }
    })
  }
};
