'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('essays', {
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
      testId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      prompt: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      taskType: {
        type: Sequelize.ENUM('task1', 'task2'),
        allowNull: false,
      },
      essayText: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      uploadedImage: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      wordCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      overallBand: {
        type: Sequelize.DECIMAL(3, 1),
        allowNull: false,
        defaultValue: 0.0,
      },
      taskResponseScore: {
        type: Sequelize.DECIMAL(3, 1),
        allowNull: false,
        defaultValue: 0.0,
      },
      coherenceScore: {
        type: Sequelize.DECIMAL(3, 1),
        allowNull: false,
        defaultValue: 0.0,
      },
      lexicalResourceScore: {
        type: Sequelize.DECIMAL(3, 1),
        allowNull: false,
        defaultValue: 0.0,
      },
      grammarScore: {
        type: Sequelize.DECIMAL(3, 1),
        allowNull: false,
        defaultValue: 0.0,
      },
      feedback: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      isScored: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      scoredAt: {
        type: Sequelize.DATE,
        allowNull: true,
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
    await queryInterface.dropTable('essays');
  }
};