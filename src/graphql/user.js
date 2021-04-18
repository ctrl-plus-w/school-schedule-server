import { gql } from 'apollo-server-core';

import { user as userShortcut } from '../utils/shortcut';
import { userObject } from '../utils/relationMapper';
import database from '../database';

import config from '../config';
import errors from '../config/errors';

export const typeDefs = gql`
  extend type Query {
    user(id: ID!): User!
    users: [User!]
    allUsers: [User!]
  }

  extend type Mutation {
    createUser(input: UserInput!): User

    deleteUserById(user_id: ID!): Boolean
    deleteUserByName(username: String!): Boolean

    destroyUserById(user_id: ID!): Boolean
    destroyUserByName(username: String!): Boolean

    addLabelById(user_id: ID!, label_id: ID!): Boolean
    addLabelByName(username: String!, label_name: String!): Boolean
    removeLabelById(user_id: ID!, label_id: ID!): Boolean
    removeLabelByName(username: String!, label_name: String!): Boolean
    clearLabelsById(user_id: ID!): Boolean
    clearLabelsByName(username: String!): Boolean

    addSubjectById(user_id: ID!, subject_id: ID!): Boolean
    addSubjectByName(username: String!, subject_name: String!): Boolean
    removeSubjectById(user_id: ID!, subject_id: ID!): Boolean
    removeSubjectByName(username: String!, subject_name: String!): Boolean
    clearSubjectsById(user_id: ID!): Boolean
    clearSubjectsByName(username: String!): Boolean

    setRoleById(user_id: ID!, role_id: ID!): Boolean
    setRoleByName(username: String!, role_name: String!): Boolean
  }

  input UserInput {
    username: String!
    full_name: String!
    password: String!
    labels_name: [String!]
    subjects_name: [String!]
    role_name: String!
  }

  type User {
    id: ID!
    username: String!
    full_name: String!
    password: String!
    labels: [Label!]
    subjects: [Subject!]
    role: Role!
    created_at: String!
    updated_at: String
    deleted_at: String
  }
`;

export const resolver = {
  Query: {
    user: async (_parent, args) => {
      const user = await userShortcut.find(args.id);
      return user ? userObject(user) : null;
    },

    users: async () => {
      const users = await userShortcut.findAll();
      return users.map(userObject);
    },

    allUsers: async () => {
      const users = await userShortcut.findAllDeleted();
      return users.map(userObject);
    },
  },

  Mutation: {
    /* +---------------------------------------------+ User */
    createUser: async (parent, { input: args }, context) => {
      if (!context?.id) throw new Error(errors.NOT_LOGGED);

      const loggedUser = await database.models.user.findByPk(context.id, { where: { deleted_at: null }, include: database.models.role });
      if (!loggedUser) throw new Error(errors.NOT_LOGGED);
      if (loggedUser?.role?.role_name !== config.ROLES.ADMIN) throw new Error(errors.NOT_ALLOWED);

      const userExist = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (userExist) throw new Error(errors.USER_DUPLICATION);

      if (args.labels_name) {
        const labels = await database.models.label.findAll({ where: { deleted_at: null, label_name: args.labels_name } });
        await loggedUser.setLabels(labels);
      }

      if (args.subjects_name) {
        const subjects = await database.models.subject.findAll({ where: { deleted_at: null, subject_name: args.subjects_name } });
        await loggedUser.setSubjects(subjects);
      }

      const role = await database.models.role.findOne({ where: { deleted_at: null, role_name: args.role_name } });
      await loggedUser.setRole(role);

      return userObject(loggedUser);
    },

    deleteUserById: async (_parent, args) => {
      const user = await database.models.user.findByPk(args.user_id, { where: { deleted_at: null } });
      if (!user) throw new Error(errors.DEFAULT);

      await user.update({ deleted_at: Date.now() });
      return true;
    },

    deleteUserByName: async (_parent, args) => {
      const user = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (!user) throw new Error(errors.DEFAULT);

      await user.update({ deleted_at: Date.now() });
      return true;
    },

    destroyUserById: async (_parent, args) => {
      const user = await database.models.user.findByPk(args.user_id, { where: { deleted_at: null } });
      if (!user) throw new Error(errors.DEFAULT);

      await user.destroy();
      return true;
    },

    destroyUserByName: async (_parent, args) => {
      const user = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (!user) throw new Error(errors.DEFAULT);

      await user.destroy();
      return true;
    },

    /* +---------------------------------------------+ Label */
    addLabelById: async (_parent, args) => {
      const user = await database.models.user.findByPk(args.user_id, { where: { deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const label = await database.models.label.findByPk(args.label_id, { where: { deleted_at: null } });
      if (!label) throw new Error("Label doesn't exist.");

      await user.addLabel(label);
      return true;
    },

    addLabelByName: async (_parent, args) => {
      const user = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const label = await database.models.label.findOne({ where: { label_name: args.label_name, deleted_at: null } });
      if (!label) throw new Error("Label doesn't exist.");

      await user.addLabel(label);
      return true;
    },

    removeLabelById: async (_parent, args) => {
      const user = await database.models.user.findByPk(args.user_id, { where: { deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const label = await database.models.label.findByPk(args.label_id, { where: { deleted_at: null } });
      if (!label) throw new Error("Label doesn't exist.");

      await user.removeLabel(label);
      return true;
    },

    removeLabelByName: async (_parent, args) => {
      const user = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const label = await database.models.label.findOne({ where: { label_name: args.label_name, deleted_at: null } });
      if (!label) throw new Error("Label doesn't exist.");

      await user.removeLabel(label);
      return true;
    },

    clearLabelsById: async (_parent, args) => {
      const user = await database.models.user.findByPk(args.user_id, { where: { deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      await user.removeLabels();
      return true;
    },

    clearLabelsByName: async (_parent, args) => {
      const user = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      await user.removeLabels();
      return true;
    },

    /* +---------------------------------------------+ Subject */
    addSubjectById: async (_parent, args) => {
      const user = await database.models.user.findByPk(args.user_id, { where: { deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const subject = await database.models.subject.findByPk(args.subject_id, { where: { deleted_at: null } });
      if (!subject) throw new Error("Subject doesn't exist.");

      await user.addSubject(subject);
      return true;
    },

    addSubjectByName: async (_parent, args) => {
      const user = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const subject = await database.models.subject.findOne({ where: { subject_name: args.subject_name, deleted_at: null } });
      if (!subject) throw new Error("Subject doesn't exist.");

      await user.addSubject(subject);
      return true;
    },

    removeSubjectById: async (_parent, args) => {
      const user = await database.models.user.findByPk(args.user_id, { where: { deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const subject = await database.models.subject.findByPk(args.subject_id, { where: { deleted_at: null } });
      if (!subject) throw new Error("Subject doesn't exist.");

      await user.removeSubject(subject);
      return true;
    },

    removeSubjectByName: async (_parent, args) => {
      const user = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const subject = await database.models.subject.findOne({ where: { subject_name: args.subject_name, deleted_at: null } });
      if (!subject) throw new Error("Subject doesn't exist.");

      await user.removeSubject(subject);
      return true;
    },

    clearSubjectsById: async (_parent, args) => {
      const user = await database.models.user.findByPk(args.user_id, { where: { deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      await user.removeSubjects();
      return true;
    },

    clearSubjectsByName: async (_parent, args) => {
      const user = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      await user.removeSubjects();
      return true;
    },

    /* +---------------------------------------------+ Role */
    setRoleById: async (_parent, args) => {
      const user = await database.models.user.findByPk(args.user_id, { where: { deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const role = await database.models.role.findByPk(args.roleId, { where: { deleted_at: null } });
      if (!role) throw new Error("Role doesn't exist.");

      await user.setRole(role);
      return true;
    },

    setRoleByName: async (_parent, args) => {
      const user = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const role = await database.models.role.findOne({ where: { role_name: args.role_name, deleted_at: null } });
      if (!role) throw new Error("Role doesn't exist.");

      await user.setRole(role);
      return true;
    },
  },
};
