import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.addColumn('essays', 'promptId', {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'prompts',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.removeColumn('essays', 'promptId');
}

