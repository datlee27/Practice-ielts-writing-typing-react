'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('essays', 'promptId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'prompts',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('essays', 'promptId');
  },
};

