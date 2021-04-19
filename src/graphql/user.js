import bcrypt from 'bcrypt';
import { gql, UserInputError, ForbiddenError } from 'apollo-server-express';

import { user as userShortcut, label as labelShortcut, subject as subjectShortcut, role as roleShortcut } from '../utils/shortcut';
import { userObject } from '../utils/relationMapper';
import { checkIsAdmin } from '../utils/authorization';

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

    addSubject(user_id: ID!, subject_id: ID!): Boolean
    removeSubject(user_id: ID!, subject_id: ID!): Boolean
    clearSubjects(user_id: ID!): Boolean

    setRole(user_id: ID!, role_id: ID!): Boolean
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
    addSubject: async (_parent, args, context) => {
      if (!context?.id) throw new ForbiddenError(errors.NOT_LOGGED);

      const loggedUser = await userShortcut.findWithRole(context.id);
      await checkIsAdmin(loggedUser);

      const user = await userShortcut.find(args.user_id);
      if (!user) throw new UserInputError(errors.DEFAULT);

      const subject = await subjectShortcut.find(args.subject_id);
      if (!subject) throw new UserInputError(errors.DEFAULT);

      await user.addSubject(subject);
      return true;
    },

    removeSubject: async (_parent, args, context) => {
      if (!context?.id) throw new ForbiddenError(errors.NOT_LOGGED);

      const loggedUser = await userShortcut.findWithRole(context.id);
      await checkIsAdmin(loggedUser);

      const user = await userShortcut.find(args.user_id);
      if (!user) throw new UserInputError(errors.DEFAULT);

      const subject = await subjectShortcut.find(args.subject_id);
      if (!subject) throw new UserInputError(errors.DEFAULT);

      await user.removeSubject(subject);
      return true;
    },

    clearSubjects: async (_parent, args, context) => {
      if (!context?.id) throw new ForbiddenError(errors.NOT_LOGGED);

      const loggedUser = await userShortcut.findWithRole(context.id);
      await checkIsAdmin(loggedUser);

      const user = await userShortcut.find(args.user_id);
      if (!user) throw new UserInputError(errors.DEFAULT);

      await user.removeSubjects();
      return true;
    },

    /* +---------------------------------------------+ Role */
    setRole: async (_parent, args, context) => {
      if (!context?.id) throw new ForbiddenError(errors.NOT_LOGGED);

      const loggedUser = await userShortcut.findWithRole(context.id);
      await checkIsAdmin(loggedUser);

      const user = await userShortcut.find(args.user_id);
      if (!user) throw new UserInputError(errors.DEFAULT);

      const role = await roleShortcut.find(args.role_id);
      if (!role) throw new UserInputError(errors.DEFAULT);

      await user.setRole(role);
      return true;
    },
  },
};
