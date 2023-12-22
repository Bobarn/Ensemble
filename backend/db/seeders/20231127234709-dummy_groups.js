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
        type: 'In person',
        private: false,
        city: 'San Diego',
        state: 'California'
      },
      {
        organizerId: 2,
        name: 'GroupTwo',
        about: 'A casual science group looking to have fun with other geeks and talk science',
        type: 'Online',
        private: false,
        city: 'San Francisco',
        state: 'California'
      },
      {
        organizerId: 3,
        name: 'GroupThree',
        about: 'A casual business group looking to have fun with other winners and talk business!',
        type: 'In person',
        private: false,
        city: 'Jacksonville',
        state: 'Florida'
      },
      {
        organizerId: 4,
        name: 'MinuteMen',
        about: 'A casual historical re-enactment group, we cover mostly US history but are open to exploring and accepting other eras and geographical origins.',
        type: 'In person',
        private: false,
        city: 'Philadelphia',
        state: 'Pennsylvania'
      },
      {
        organizerId: 5,
        name: 'NewGen Exchange',
        about: 'A safe space for exchanging and spreading cultural highlights with others',
        type: 'In person',
        private: false,
        city: 'New York City',
        state: 'New York'
      },
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
