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
      type: 'In person',
      capacity: 50,
      price: 0.00,
      startDate: '2023-10-22',
      endDate: '2023-10-23'
    },
    {
      venueId: 2,
      groupId: 2,
      name: 'Convention',
      description: 'Science show',
      type: 'In person',
      capacity: 100,
      price: 10.00,
      startDate: '2023-10-25',
      endDate: '2023-11-02'
    },
    {
      venueId: 3,
      groupId: 3,
      name: 'Meet and greet',
      description: 'Show and tell',
      type: 'Online',
      capacity: 20,
      price: 0.00,
      startDate: '2023-10-22',
      endDate: '2023-10-22'
    },
    {
      venueId: 2,
      groupId: 2,
      name: 'Elementary Science Fair',
      description: 'A quick look inside the great world that lives inside the minds of the next generation of science lovers and a fun opportunity to fundraise.',
      type: 'In person',
      capacity: 200,
      price: 5.00,
      startDate: '2024-09-22',
      endDate: '2024-10-26'
    },
    {
      venueId: 5,
      groupId: 5,
      name: 'Food Market',
      description: 'Meet up, set up a stall and lay down your food for the rest to see. All proceeds will go towards a trip to the country of the raffle winner at the end!',
      type: 'In person',
      capacity: 400,
      price: 10.00,
      startDate: '2025-04-16',
      endDate: '2025-05-02'
    },
    {
      venueId: 4,
      groupId: 4,
      name: 'Revolutionary Re-enactment',
      description: 'At the public park we will be putting on a display for all to see the resilience and ingenuity shown in some of the decisive battles for our independence.',
      type: 'In person',
      capacity: 250,
      price: 0.00,
      startDate: '2024-12-22',
      endDate: '2024-12-23'
    },
    {
      venueId: 1,
      groupId: 1,
      name: 'Cheer and Career Fair',
      description: 'We have invited several small companies to hold booths while recruiting and networking amongst our members. Hoping to see you all there for some excellent opportunities.',
      type: 'In person',
      capacity: 120,
      price: 5.00,
      startDate: '2024-01-22',
      endDate: '2024-01-23'
    },
    {
      venueId: 3,
      groupId: 3,
      name: 'Next-Steps Seminar',
      description: 'This seminar we have invited several self-made successful CEOs and businessmen from our local community to hear their tips and tricks towards pursuing your goals.',
      type: 'Online',
      capacity: 200,
      price: 0.00,
      startDate: '2024-2-16',
      endDate: '2024-2-16 19:00:00'
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
