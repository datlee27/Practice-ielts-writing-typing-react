import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

export interface EssayAttributes {
  id: number;
  userId?: number;
  testId?: number;
  prompt: string;
  taskType: 'task1' | 'task2';
  essayText: string;
  uploadedImage?: string;
  wordCount: number;
  overallBand: number;
  taskResponseScore: number;
  coherenceScore: number;
  lexicalResourceScore: number;
  grammarScore: number;
  feedback?: string;
  isScored: boolean;
  scoredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface EssayCreationAttributes extends Omit<EssayAttributes, 'id' | 'createdAt' | 'updatedAt' | 'scoredAt'> {
  scoredAt?: Date;
}

class Essay extends Model<EssayAttributes, EssayCreationAttributes> implements EssayAttributes {
  public id!: number;
  public userId?: number;
  public testId?: number;
  public prompt!: string;
  public taskType!: 'task1' | 'task2';
  public essayText!: string;
  public uploadedImage?: string;
  public wordCount!: number;
  public overallBand!: number;
  public taskResponseScore!: number;
  public coherenceScore!: number;
  public lexicalResourceScore!: number;
  public grammarScore!: number;
  public feedback?: string;
  public isScored!: boolean;
  public scoredAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly author?: User;
}

Essay.init(
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
    testId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    prompt: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    taskType: {
      type: DataTypes.ENUM('task1', 'task2'),
      allowNull: false,
    },
    essayText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    uploadedImage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    wordCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    overallBand: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false,
      defaultValue: 0.0,
    },
    taskResponseScore: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false,
      defaultValue: 0.0,
    },
    coherenceScore: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false,
      defaultValue: 0.0,
    },
    lexicalResourceScore: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false,
      defaultValue: 0.0,
    },
    grammarScore: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false,
      defaultValue: 0.0,
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isScored: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    scoredAt: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: 'essays',
    timestamps: true,
  }
);

export default Essay;