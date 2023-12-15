'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Venue } = require('../models');

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
   options.tableName = 'Venues';

    return await Venue.bulkCreate([
      {
        groupId: 1,
        address: '123 First Street',
        city: 'San Diego',
        state: 'California',
        lat: 32.486,
        lng: 74.2
      },
      {
        groupId: 2,
        address: '456 Fourth Street',
        city: 'San Francisco',
        state: 'California',
        lat: 12.486,
        lng: 74.2
      },
      {
        groupId: 3,
        address: '123 First Street',
        city: 'Jacksonville',
        state: 'Florida',
        lat: 32.486,
        lng: 16.2
      },
      {
        groupId: 4,
        address: '926 Liberty Lane',
        city: 'Philadelphia',
        state: 'Pennsylvania',
        lat: -12.486,
        lng: 21.2
      },
      {
        groupId: 5,
        address: '123 First Street',
        city: 'New York City',
        state: 'New York',
        lat: -32.486,
        lng: 26.2
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
    options.tableName = 'Venues'

    const Op = Sequelize.Op;

    return await queryInterface.bulkDelete(options, {
        id: {
          [Op.in]: [1, 2, 3]
        }
    })
  }
};
