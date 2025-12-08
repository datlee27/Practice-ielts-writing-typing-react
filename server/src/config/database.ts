import { Sequelize } from 'sequelize';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const useSQLite = process.env.USE_SQLITE === 'true' || !process.env.DB_HOST;

// Use SQLite for development if MySQL is not configured
const sequelize = useSQLite ? new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
}) : new Sequelize(
  process.env.DB_NAME || 'ielts_writing_practice',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default sequelize;