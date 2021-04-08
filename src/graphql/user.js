import { gql } from 'apollo-server-core';
import bcrypt from 'bcrypt';

import { userObject } from '../utils/relationMapper';
import database from '../database';

export const typeDefs = gql`
  extend type Query {
    user(id: ID!): User!
    users: [User!]
  }

  extend type Mutation {
    createUser(input: UserInput!): User

    deleteUserById(user_id: ID!): Boolean
    deleteUserByName(username: ID!): Boolean

    destroyUserById(user_id: ID!): Boolean
    destroyUserByName(username: ID!): Boolean

    addLabelById(user_id: ID!, label_id: ID!): Boolean
    addLabelByName(username: String!, label_name: String!): Boolean
    removeLabelById(user_id: ID!, label_id: ID!): Boolean
    removeLabelByName(username: String!, label_name: String!): Boolean
    clearLabelsById(user_id: ID!): Boolean
    clearLabelsByName(username: ID!): Boolean

    addSubjectById(user_id: ID!, subject_id: ID!): Boolean
    addSubjectByName(username: String!, subject_name: String!): Boolean
    removeSubjectById(user_id: ID!, subject_id: ID!): Boolean
    removeSubjectByName(username: String!, subject_name: String!): Boolean
    clearSubjectsById(user_id: ID!): Boolean
    clearSubjectsByName(username: ID!): Boolean

    setRoleById(user_id: ID!, role_id: ID!): Boolean
    setRoleByName(username: ID!, role_name: ID!): Boolean
  }

  input UserInput {
    username: String!
    full_name: String!
    password: String!
  }

  type User {
    id: ID!
    username: String!
    full_name: String!
    password: String!
    labels: [Label!]
    subjects: [Subject!]
    role: Role
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

    users: async (parent, args, context) => {
      console.log(context);

      const users = await database.models.user.findAll({ where: { deleted_at: null } });
      return users.map(userObject);
    },
  },

  // TODO : [ ] Get the request to do the autorization.

  Mutation: {
    /* +---------------------------------------------+ User */
    createUser: async (_, { input: args }) => {
      const userExist = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (userExist) throw new Error('User already exist.');

      const cryptedPassword = bcrypt.hashSync(args.password, 12);
      const user = await database.models.user.create({ username: args.username, full_name: args.full_name, password: cryptedPassword });

      return userObject(user);
    },

    deleteUserById: async (_, args) => {
      const user = await database.models.user.findByPk(args.user_id, { where: { deleted_at: null } });
      if (!user) throw new Error('User not found.');

      await user.update({ deleted_at: Date.now() });
      return true;
    },

    deleteUserByName: async (_, args) => {
      const user = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (!user) throw new Error('User not found.');

      await user.update({ deleted_at: Date.now() });
      return true;
    },

    destroyUserById: async (_, args) => {
      const user = await database.models.user.findByPk(args.user_id, { where: { deleted_at: null } });
      if (!user) throw new Error('User not found.');

      await user.destroy();
      return true;
    },

    destroyUserByName: async (_, args) => {
      const user = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (!user) throw new Error('User not found.');

      await user.destroy();
      return true;
    },

    /* +---------------------------------------------+ Label */
    addLabelById: async (_, args) => {
      const user = await database.models.user.findByPk(args.user_id, { where: { deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

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
