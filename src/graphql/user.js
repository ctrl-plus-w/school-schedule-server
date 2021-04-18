import { gql } from 'apollo-server-core';
import bcrypt from 'bcrypt';

import { checkIsAdmin } from '../utils/authorization';
import { userObject } from '../utils/relationMapper';

import { label as labelShortcut, subject as subjectShortcut, role as roleShortcut, user as userShortcut } from '../utils/shortcut';
import database from '../database';

import errors from '../config/errors';

export const typeDefs = gql`
  extend type Query {
    user(id: ID!): User!
    users: [User!]
    allUsers: [User!]
  }

  extend type Mutation {
    createUser(input: UserInput!): User

    deleteUser(id: ID!): Boolean
    destroyUser(id: ID!): Boolean

    addLabel(user_id: ID!, label_id: ID!): Boolean
    removeLabel(user_id: ID!, label_id: ID!): Boolean
    clearLabels(): Boolean

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
    user: async (_, args) => {
      const user = await database.models.user.findByPk(args.id, { where: { deleted_at: null } });
      return user ? userObject(user) : null;
    },

    users: async () => {
      const users = await database.models.user.findAll({ where: { deleted_at: null } });
      return users.map(userObject);
    },

    allUsers: async () => {
      const users = await database.models.user.findAll();
      return users.map(userObject);
    },
  },

  Mutation: {
    /* +---------------------------------------------+ User */
    createUser: async (parent, { input: args }) => {
      const userExist = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (userExist) throw new Error(errors.USER_DUPLICATION);

      const cryptedPassword = await bcrypt.hash(args.password, 12);

      const user = await database.models.user.create({ username: args.username, full_name: args.full_name, password: cryptedPassword });

      if (args.labels_name) {
        const labels = await labelShortcut.findAllByName(args.labels_name);
        await user.setLabels(labels);
      }

      if (args.subjects_name) {
        const subjects = await subjectShortcut.findAllByName(args.subjects_name);
        await user.setSubjects(subjects);
      }

      const role = await roleShortcut.findByName(args.role_name);
      await user.setRole(role);

      return userObject(user);
    },

    deleteUser: async (parent, args, context) => {
      if (!context?.id) throw new Error(errors.NOT_LOGGED);

      const loggedUser = await userShortcut.findWithRole(context.id);
      checkIsAdmin(loggedUser);

      const user = await userShortcut.find(args.id);
      if (!user) throw new Error(errors.DEFAULT);

      await user.update({ deleted_at: Date.now() });
      return true;
    },

    destroyUser: async (parent, args, context) => {
      if (!context?.id) throw new Error(errors.NOT_LOGGED);

      const loggedUser = await userShortcut.findWithRole(context.id);
      checkIsAdmin(loggedUser);

      const user = await userShortcut.findDeleted(args.id);
      if (!user) throw new Error(errors.DEFAULT);

      await user.update({ deleted_at: Date.now() });
      return true;
    },

    /* +---------------------------------------------+ Label */
    addLabel: async (parent, args, context) => {
      if (!context?.id) throw new Error(errors.NOT_LOGGED);

      const loggedUser = await userShortcut.findWithRole(context.id);
      checkIsAdmin(loggedUser);

      const user = await userShortcut.find(args.user_id);
      if (!user) throw new Error(errors.DEFAULT);

      const label = await database.models.label.findByPk(args.label_id, { where: { deleted_at: null } });
      if (!label) throw new Error("Label doesn't exist.");

      await user.addLabel(label);
      return true;
    },

    addLabelByName: async (_, args) => {
      const user = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const label = await database.models.label.findOne({ where: { label_name: args.label_name, deleted_at: null } });
      if (!label) throw new Error("Label doesn't exist.");

      await user.addLabel(label);
      return true;
    },

    removeLabelById: async (_, args) => {
      const user = await database.models.user.findByPk(args.user_id, { where: { deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const label = await database.models.label.findByPk(args.label_id, { where: { deleted_at: null } });
      if (!label) throw new Error("Label doesn't exist.");

      await user.removeLabel(label);
      return true;
    },

    removeLabelByName: async (_, args) => {
      const user = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const label = await database.models.label.findOne({ where: { label_name: args.label_name, deleted_at: null } });
      if (!label) throw new Error("Label doesn't exist.");

      await user.removeLabel(label);
      return true;
    },

    clearLabelsById: async (_, args) => {
      const user = await database.models.user.findByPk(args.user_id, { where: { deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      await user.removeLabels();
      return true;
    },

    clearLabelsByName: async (_, args) => {
      const user = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      await user.removeLabels();
      return true;
    },

    /* +---------------------------------------------+ Subject */
    addSubjectById: async (_, args) => {
      const user = await database.models.user.findByPk(args.user_id, { where: { deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const subject = await database.models.subject.findByPk(args.subject_id, { where: { deleted_at: null } });
      if (!subject) throw new Error("Subject doesn't exist.");

      await user.addSubject(subject);
      return true;
    },

    addSubjectByName: async (_, args) => {
      const user = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const subject = await database.models.subject.findOne({ where: { subject_name: args.subject_name, deleted_at: null } });
      if (!subject) throw new Error("Subject doesn't exist.");

      await user.addSubject(subject);
      return true;
    },

    removeSubjectById: async (_, args) => {
      const user = await database.models.user.findByPk(args.user_id, { where: { deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const subject = await database.models.subject.findByPk(args.subject_id, { where: { deleted_at: null } });
      if (!subject) throw new Error("Subject doesn't exist.");

      await user.removeSubject(subject);
      return true;
    },

    removeSubjectByName: async (_, args) => {
      const user = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const subject = await database.models.subject.findOne({ where: { subject_name: args.subject_name, deleted_at: null } });
      if (!subject) throw new Error("Subject doesn't exist.");

      await user.removeSubject(subject);
      return true;
    },

    clearSubjectsById: async (_, args) => {
      const user = await database.models.user.findByPk(args.user_id, { where: { deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      await user.removeSubjects();
      return true;
    },

    clearSubjectsByName: async (_, args) => {
      const user = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      await user.removeSubjects();
      return true;
    },

    /* +---------------------------------------------+ Role */
    setRoleById: async (_, args) => {
      const user = await database.models.user.findByPk(args.user_id, { where: { deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const role = await database.models.role.findByPk(args.roleId, { where: { deleted_at: null } });
      if (!role) throw new Error("Role doesn't exist.");

      await user.setRole(role);
      return true;
    },

    setRoleByName: async (_, args) => {
      const user = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const role = await database.models.role.findOne({ where: { role_name: args.role_name, deleted_at: null } });
      if (!role) throw new Error("Role doesn't exist.");

      await user.setRole(role);
      return true;
    },
  },
};
