'use strict';

/** @type {import('sequelize-cli').Migration} */

const { GroupImage } = require('../models');

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
    await GroupImage.bulkCreate([
      {
        groupId: 1,
        url: 'https://example.com/',
        preview: false
      },
      {
        groupId: 2,
        url: 'https://i.imgur.com/CHE6ilh.jpg',
        preview: true
      },
      {
        groupId: 3,
        url: 'https://vercel.com/new/templates',
        preview: false
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
    options.tableName = 'GroupImages';

    const Op = Sequelize.Op;

    return await queryInterface.bulkDelete(options, {
      url: {
        [Op.in]: ['https://vercel.com/new/templates', 'https://i.imgur.com/CHE6ilh.jpg', 'https://example.com/']
      }
    }, {})
  }
};