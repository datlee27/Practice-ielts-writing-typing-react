'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add sampleEssay column to prompts table
    await queryInterface.addColumn('prompts', 'sampleEssay', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('prompts', 'sampleEssay');
  }
};
