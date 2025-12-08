'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tests', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      promptId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'prompts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      testType: {
        type: Sequelize.ENUM('practice', 'mock', 'custom'),
        allowNull: false,
        defaultValue: 'practice',
      },
      mode: {
        type: Sequelize.ENUM('preset', 'custom'),
        allowNull: false,
        defaultValue: 'preset',
      },
      sampleText: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      userInput: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      wpm: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },
      accuracy: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },
      timeSpent: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      wordCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      completedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tests');
  }
};