/**
 * User Model
 *
 * This model represents a user in the task management system.
 * It demonstrates:
 * 1. TypeScript interfaces for type safety
 * 2. Sequelize model definition with validations
 * 3. Database relationships (hasMany)
 * 4. Password hashing and validation
 * 5. Email format validation
 */

import { Model, DataTypes } from "sequelize";
import { Task } from "./Task";
import { Project } from "./Project";
import sequelize from "../config/database";

/**
 * User Model Class
 *
 * Extends Sequelize's Model class to create a User model with:
 * - Type-safe attributes
 * - Validations
 * - Database relationships
 * - Password handling
 */
export class User extends Model {
  // Basic properties
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public firstName!: string;
  public lastName!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Simple association types
  public getTasks!: () => Promise<any[]>;
  public getProjects!: () => Promise<any[]>;

  /**
   * Get the user's full name
   *
   * @returns string - The user's full name
   */
  public getFullName(): string {
    const fullName = this.firstName + " " + this.lastName;
    return fullName;
  }

  /**
   * Get the user's task completion rate
   *
   * @returns Promise<string> - Completion rate percentage (e.g., "75%")
   */
  public async getTaskCompletionRate(): Promise<string> {
    const tasks = await this.getTasks();
    const completedTasks = tasks.filter((task) => task.status === "completed");
    const completionRate = (completedTasks.length / tasks.length) * 100;
    // 1. Get all tasks belonging to this user
    // 2. Count how many have status 'completed'
    // 3. Calculate the percentage and return it as a string with % symbol
    return completionRate.toFixed(0) + "%";
  }

  /**
   * Get the user's active projects count
   *
   * @returns Promise<number> - Number of active projects
   */
  public async getActiveProjectsCount(): Promise<number> {
    const projects = await this.getProjects();
    const activeProjects = projects.filter((project) => project.status === "active");
    // Use a Sequelize query with a where clause to filter by status
    return activeProjects.length;
  }
}

// Initialize the User model with Sequelize
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 30],
        isAlphanumeric: true,
      },
      // 1. Must be unique
      // 2. Length between 3-30 characters
      // 3. Can only contain alphanumeric characters (letters and numbers)
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        isLowercase: true,
      },

      // 1. Must be unique
      // 2. Must be a valid email format
      // 3. Normalize email to lowercase before saving
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 100],
        isStrongPassword(value: string) {
          // Check if the password meets the criteria:
          const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,100}$/;
          if (!strongPasswordRegex.test(value)) {
            throw new Error("Password must contain at least one uppercase letter, one number, and one special character.");
          }
        },
      },
      // 1. Length between 8-100 characters
      // 2. Must contain at least one uppercase letter
      // 3. Must contain at least one number
      // 4. Must contain at least one special character
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50],
        is: /^[a-zA-Z]+$/,
      },
      // 1. Length between 2-50 characters
      // 2. Cannot contain numbers or special characters
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50],
        is: /^[a-zA-Z]+$/,
      },
      // 1. Length between 2-50 characters
      // 2. Cannot contain numbers or special characters
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
    tableName: "users",
    modelName: "User",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["username"],
      },
      {
        unique: true,
        fields: ["email"],
      },
    ],
    hooks: {},
  }
);
