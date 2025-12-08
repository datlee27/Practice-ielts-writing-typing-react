import sequelize from '../config/database';
import User from './User';
import Prompt from './Prompt';
import Test from './Test';
import Essay from './Essay';

// Define all associations
User.hasMany(Test, { foreignKey: 'userId', as: 'tests' });
User.hasMany(Essay, { foreignKey: 'userId', as: 'essays' });

Prompt.hasMany(Test, { foreignKey: 'promptId', as: 'tests' });

Test.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Test.belongsTo(Prompt, { foreignKey: 'promptId', as: 'prompt' });

Essay.belongsTo(User, { foreignKey: 'userId', as: 'essayUser' });

export {
  sequelize,
  User,
  Prompt,
  Test,
  Essay,
};

export default {
  sequelize,
  User,
  Prompt,
  Test,
  Essay,
};