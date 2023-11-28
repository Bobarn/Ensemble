'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Event } = require('../models');

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
   await Event.bulkCreate([
    {
      venueId: 1,
      groupId: 1,
      name: 'Festival',
      description: 'Fun in the sun for the mun',
      type: 'in-person',
      capacity: 50,
      price: 0.00,
      startDate: '10-22-2023',
      endDate: '10-23-2023'
    },
    {
      venueId: 2,
      groupId: 2,
      name: 'Convention',
      description: 'Science show',
      type: 'hybrid',
      capacity: 100,
      price: 10.00,
      startDate: '10-25-2023',
      endDate: '11-2-2023'
    },
    {
      venueId: 3,
      groupId: 3,
      name: 'Meet and greet',
      description: 'Show and tell',
      type: 'in-person',
      capacity: 20,
      price: 0.00,
      startDate: '10-22-2023',
      endDate: '10-23-2023'
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
    options.tableName = 'Events';

    const Op = Sequelize.Op;

    return await queryInterface.bulkDelete(options, {
      name: {
        [Op.in]: ['Festival', 'Convention', 'Meet and greet']
      }
    }, {})
  }
};
