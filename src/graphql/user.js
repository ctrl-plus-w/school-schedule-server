import bcrypt from 'bcrypt';
import { gql, UserInputError, ForbiddenError } from 'apollo-server-express';

import { user as userShortcut, label as labelShortcut, subject as subjectShortcut, role as roleShortcut } from '../utils/shortcut';
import { userObject } from '../utils/relationMapper';
import { checkIsAdmin } from '../utils/authorization';

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

    addLabel(user_id: String!, label_id: String!): Boolean
    removeLabel(user_id: String!, label_id: String!): Boolean
    clearLabels(user_id: String!): Boolean

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
    createUser: async (_parent, { input: args }, context) => {
      if (!context?.id) throw new ForbiddenError(errors.NOT_LOGGED);

      const loggedUser = await userShortcut.findWithRole(context.id);
      await checkIsAdmin(loggedUser);

      const userExist = await userShortcut.findByUsername(args.username);
      if (userExist) throw new UserInputError(errors.USER_DUPLICATION);

      const password = await bcrypt.hash(args.password, 12);
      const user = await userShortcut.create({ username: args.username, full_name: args.full_name, password: password });

      if (args.labels_name) {
        const labels = await labelShortcut.findAllWithCondition({ label_name: args.labels_name });
        await user.setLabels(labels);
      }

      if (args.subjects_name) {
        const subjects = await subjectShortcut.findAllWithCondition({ subject_name: args.subjects_name });
        await user.setSubjects(subjects);
      }

      const role = await roleShortcut.findBy({ role_name: args.role_name });
      if (!role) throw new UserInputError(errors.DEFAULT);
      await user.setRole(role);

      return userObject(user);
    },

    deleteUser: async (_parent, args, context) => {
      if (!context?.id) throw new ForbiddenError(errors.NOT_LOGGED);

      const loggedUser = await userShortcut.findWithRole(context.id);
      await checkIsAdmin(loggedUser);

      const user = await userShortcut.find(args.id);
      if (!user) throw new UserInputError(errors.DEFAULT);

      await user.update({ deleted_at: Date.now() });
      return true;
    },

    destroyUser: async (_parent, args, context) => {
      if (!context?.id) throw new ForbiddenError(errors.NOT_LOGGED);

      const loggedUser = await userShortcut.findWithRole(context.id);
      await checkIsAdmin(loggedUser);

      const user = await userShortcut.find(args.id);
      if (!user) throw new UserInputError(errors.DEFAULT);

      await user.destroy();
      return true;
    },

    /* +---------------------------------------------+ Label */
    addLabel: async (_parent, args, context) => {
      if (!context?.id) throw new ForbiddenError(errors.NOT_LOGGED);

      const loggedUser = await userShortcut.findWithRole(context.id);
      await checkIsAdmin(loggedUser);

      const user = await userShortcut.find(args.user_id);
      if (!user) throw new UserInputError(errors.DEFAULT);

      const label = await labelShortcut.find(args.label_id);
      if (!label) throw new UserInputError(errors.DEFAULT);

      await user.addLabel(label);
      return true;
    },

    removeLabel: async (_parent, args, context) => {
      if (!context?.id) throw new ForbiddenError(errors.NOT_LOGGED);

      const loggedUser = await userShortcut.findWithRole(context.id);
      await checkIsAdmin(loggedUser);

      const user = await userShortcut.find(args.user_id);
      if (!user) throw new UserInputError(errors.DEFAULT);

      const label = await labelShortcut.find(args.label_id);
      if (!label) throw new UserInputError(errors.DEFAULT);

      await user.removeLabel(label);
      return true;
    },

    clearLabels: async (_parent, args, context) => {
      if (!context?.id) throw new ForbiddenError(errors.NOT_LOGGED);

      const loggedUser = await userShortcut.findWithRole(context.id);
      await checkIsAdmin(loggedUser);

      const user = await userShortcut.find(args.user_id);
      if (!user) throw new UserInputError(errors.DEFAULT);

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
