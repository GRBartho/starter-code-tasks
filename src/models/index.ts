/**
 * Models Index
 *
 * This file serves as the central point for all database models.
 * It:
 * 1. Imports all models
 * 2. Sets up model associations
 * 3. Exports all models for use in the application
 */

import { User } from "./User";
import { Task } from "./Task";
import { Project } from "./Project";
import { Tag } from "./Tag";
import sequelize from "../config/database";

// Set up basic associations between models
User.hasMany(Task, {
  as: "tasks",
  foreignKey: "userId",
  onDelete: "CASCADE", // When a user is deleted, delete all their tasks
});

Task.belongsTo(User, {
  as: "user",
  foreignKey: "userId",
});

Project.hasMany(Task, {
  as: "tasks",
  foreignKey: "projectId",
  onDelete: "CASCADE", // When a project is deleted, delete all its tasks
});

Task.belongsTo(Project, {
  as: "project",
  foreignKey: "projectId",
});

Task.belongsToMany(Tag, {
  through: "TaskTags",
  as: "tags",
  foreignKey: "taskId",
});

Tag.belongsToMany(Task, {
  through: "TaskTags",
  as: "tasks",
  foreignKey: "tagId",
});

// Global hooks for logging model changes
sequelize.addHook("afterCreate", (instance) => {
  console.log(`New record created in ${instance.constructor.name} with ID: ${(instance as any).id}`);
});

sequelize.addHook("afterUpdate", (instance) => {
  console.log(`Record updated in ${instance.constructor.name} with ID: ${(instance as any).id}`);
});

sequelize.addHook("afterDestroy", (instance) => {
  console.log(`Record deleted from ${instance.constructor.name} with ID: ${(instance as any).id}`);
});

// Export all models
export { User, Task, Project, Tag, sequelize };
