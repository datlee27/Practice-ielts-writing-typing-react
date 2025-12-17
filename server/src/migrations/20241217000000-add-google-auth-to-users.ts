import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    // Add uuid column
    await queryInterface.addColumn('users', 'uuid', {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    });

    // Make password nullable for Google users
    await queryInterface.changeColumn('users', 'password', {
      type: DataTypes.STRING(255),
      allowNull: true,
    });

    // Add Google auth fields
    await queryInterface.addColumn('users', 'googleId', {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    });

    await queryInterface.addColumn('users', 'provider', {
      type: DataTypes.ENUM('local', 'google'),
      allowNull: false,
      defaultValue: 'local',
    });

    // Update existing users to have 'local' provider
    await queryInterface.sequelize.query(`
      UPDATE users SET provider = 'local', uuid = UUID() WHERE provider IS NULL;
    `);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('users', 'uuid');
    await queryInterface.removeColumn('users', 'googleId');
    await queryInterface.removeColumn('users', 'provider');

    // Revert password to not nullable
    await queryInterface.changeColumn('users', 'password', {
      type: DataTypes.STRING(255),
      allowNull: false,
    });
  },
};
