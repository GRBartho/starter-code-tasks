/**
 * Task Model
 *
 * This model represents a task in the task management system.
 * It demonstrates:
 * 1. TypeScript interfaces for type safety
 * 2. Sequelize model definition with validations
 * 3. Instance methods for business logic
 * 4. Database relationships (belongsTo, belongsToMany)
 * 5. Custom validations and hooks
 */

import { Model, DataTypes } from "sequelize";
import { User } from "./User";
import { Project } from "./Project";
import { Tag } from "./Tag";
import sequelize from "../config/database";

// Keep these simple type definitions for enums
export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type TaskPriority = "low" | "medium" | "high";

/**
 * Task Model Class
 *
 * Extends Sequelize's Model class to create a Task model with:
 * - Type-safe attributes
 * - Validations
 * - Instance methods
 * - Database relationships
 */
export class Task extends Model {
  // Basic properties
  public id!: number;
  public title!: string;
  public description!: string;
  public status!: TaskStatus;
  public dueDate!: Date;
  public priority!: TaskPriority;
  public userId!: number;
  public projectId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Simple association methods
  public getUser!: () => Promise<User>;
  public getProject!: () => Promise<Project>;
  public getTags!: () => Promise<Tag[]>;
  public addTags!: (tags: any | any[]) => Promise<void>;
  public removeTags!: (tags: any | any[]) => Promise<void>;

  /**
   * Check if the task is overdue
   *
   * @returns boolean - true if the task's due date is in the past
   */
  public isOverdue(): boolean {
    if (this.dueDate < new Date() && this.status !== "completed") {
      return true;
    } else {
      return false;
    }
    // 1. Compare the dueDate with the current date
    // 2. Return true if dueDate is in the past and status is not 'completed'
    // 3. Return false otherwise
  }

  /**
   * Calculate the task's progress
   *
   * @returns string - Progress percentage (e.g., "50%")
   */
  public getProgress(): string {
    switch (this.status) {
      case "completed":
        return "100%";
      case "in_progress":
        return "50%";
      case "cancelled":
        return "0%";
      default:
        return "0%";
    }
  }
}

// Initialize the Task model with Sequelize
Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [3, 100], // Title must be between 3 and 100 characters
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
      validate: {
        isIn: [["pending", "in_progress", "completed", "cancelled"]],
      },
      // 1. Must be one of: 'pending', 'in_progress', 'completed', 'cancelled'
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isFutureDate(value: Date) {
          if (value <= new Date()) {
            throw new Error("Due date must be in the future");
          }
        },
      },
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "medium",
      validate: {
        isIn: [["low", "medium", "high"]],
      },
      // 1. Must be one of: 'low', 'medium', 'high'
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "projects",
        key: "id",
      },
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
    tableName: "tasks",
    modelName: "Task",
    timestamps: true,
    indexes: [
      {
        fields: ["userId"],
      },
      {
        fields: ["projectId"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["dueDate"],
      },
    ],
    hooks: {},
  }
);
