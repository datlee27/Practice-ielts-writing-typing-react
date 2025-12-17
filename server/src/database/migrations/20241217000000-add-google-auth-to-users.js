'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add uuid column (nullable first, then make it not null)
    await queryInterface.addColumn('users', 'uuid', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: true,
    });

    // Add Google auth fields
    await queryInterface.addColumn('users', 'googleId', {
      type: Sequelize.STRING(255),
      allowNull: true,
      unique: true,
    });

    await queryInterface.addColumn('users', 'provider', {
      type: Sequelize.ENUM('local', 'google'),
      allowNull: false,
      defaultValue: 'local',
    });

    // Update existing users to have 'local' provider and generate UUIDs
    await queryInterface.sequelize.query(`
      UPDATE users SET provider = 'local' WHERE provider IS NULL OR provider = '';
    `);

    // Generate UUIDs for existing users
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users WHERE uuid IS NULL',
      { type: Sequelize.QueryTypes.SELECT }
    );

    for (const user of users) {
      const uuid = require('crypto').randomUUID();
      await queryInterface.sequelize.query(
        'UPDATE users SET uuid = ? WHERE id = ?',
        { replacements: [uuid, user.id] }
      );
    }

    // Make password nullable for Google users
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    // Make uuid not null and unique
    await queryInterface.changeColumn('users', 'uuid', {
      type: Sequelize.UUID,
      allowNull: false,
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'uuid');
    await queryInterface.removeColumn('users', 'googleId');
    await queryInterface.removeColumn('users', 'provider');

    // Revert password to not nullable
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
  },
};
