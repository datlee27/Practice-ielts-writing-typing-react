import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Prompt from './Prompt';

export interface TestAttributes {
  id: number;
  userId?: number;
  promptId?: number;
  testType: 'practice' | 'mock' | 'custom';
  mode: 'preset' | 'custom';
  sampleText?: string;
  userInput: string;
  wpm: number;
  accuracy: number;
  timeSpent: number;
  wordCount: number;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestCreationAttributes extends Omit<TestAttributes, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'> {
  completedAt?: Date;
}

class Test extends Model<TestAttributes, TestCreationAttributes> implements TestAttributes {
  public id!: number;
  public userId?: number;
  public promptId?: number;
  public testType!: 'practice' | 'mock' | 'custom';
  public mode!: 'preset' | 'custom';
  public sampleText?: string;
  public userInput!: string;
  public wpm!: number;
  public accuracy!: number;
  public timeSpent!: number;
  public wordCount!: number;
  public completedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly user?: User;
  public readonly prompt?: Prompt;
}

Test.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'id',
      },
    },
    promptId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Prompt,
        key: 'id',
      },
    },
    testType: {
      type: DataTypes.ENUM('practice', 'mock', 'custom'),
      allowNull: false,
      defaultValue: 'practice',
    },
    mode: {
      type: DataTypes.ENUM('preset', 'custom'),
      allowNull: false,
      defaultValue: 'preset',
    },
    sampleText: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userInput: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    wpm: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
    },
    accuracy: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
    },
    timeSpent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    wordCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
    tableName: 'tests',
    timestamps: true,
  }
);

export default Test;