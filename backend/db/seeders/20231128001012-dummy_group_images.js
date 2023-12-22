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
        url: 'https://picsum.photos/200.jpg',
        preview: true
      },
      {
        groupId: 2,
        url: 'https://i.imgur.com/CHE6ilh.jpg',
        preview: true
      },
      {
        groupId: 3,
        url: 'https://picsum.photos/300?random=2',
        preview: true
      },
      {
        groupId: 4,
        url: 'https://picsum.photos/seed/picsum/200/300/?blur',
        preview: true
      },
      {
        groupId: 5,
        url: 'https://picsum.photos/seed/picsum/200/300',
        preview: true
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
        [Op.in]: ['https://picsum.photos/200/300?random=2', 'https://i.imgur.com/CHE6ilh.jpg', 'https://picsum.photos/seed/picsum/200/300/?blur', 'https://picsum.photos/200.jpg']
      }
    }, {})
  }
};
