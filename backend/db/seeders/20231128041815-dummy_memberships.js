'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Membership } = require('../models');

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
    await Membership.bulkCreate([
      {
        userId: 1,
        groupId: 1,
        status: 'accepted'
      },
      {
        userId: 2,
        groupId: 2,
        status: 'accepted'
      },
      {
        userId: 3,
        groupId: 3,
        status: 'accepted'
      },
      {
        userId: 1,
        groupId: 2,
        status: 'pending'
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
    options.tableName = 'Memberships';

    const Op = Sequelize.Op;

    return await queryInterface.bulkDelete(options, {
      userId: {
        [Op.in]: [1, 2, 3]
      }
    }, {})
  }
};
