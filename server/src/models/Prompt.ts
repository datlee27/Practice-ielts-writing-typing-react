import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface PromptAttributes {
  id: number;
  title: string;
  content: string;
  taskType: 'task1' | 'task2';
  difficulty: 'easy' | 'medium' | 'hard';
  category?: string;
  wordCount: number;
  timeLimit: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromptCreationAttributes extends Omit<PromptAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Prompt extends Model<PromptAttributes, PromptCreationAttributes> implements PromptAttributes {
  public id!: number;
  public title!: string;
  public content!: string;
  public taskType!: 'task1' | 'task2';
  public difficulty!: 'easy' | 'medium' | 'hard';
  public category?: string;
  public wordCount!: number;
  public timeLimit!: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Prompt.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    taskType: {
      type: DataTypes.ENUM('task1', 'task2'),
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.ENUM('easy', 'medium', 'hard'),
      allowNull: false,
      defaultValue: 'medium',
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    wordCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 250,
    },
    timeLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 40,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'prompts',
    timestamps: true,
  }
);

export default Prompt;