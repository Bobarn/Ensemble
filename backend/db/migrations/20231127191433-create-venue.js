'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Venues', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      groupId: {
        type: Sequelize.INTEGER,
      },
      address: {
        type: Sequelize.VARCHAR(50),
        allowNull: false
      },
      city: {
        type: Sequelize.VARCHAR(50),
        allowNull: false
      },
      state: {
        type: Sequelize.VARCHAR(50),
        allowNull: false
      },
      lat: {
        type: Sequelize.DECIMAL
      },
      ing: {
        type: Sequelize.DECIMAL
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Venues');
  }
};
