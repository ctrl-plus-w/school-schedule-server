import { gql } from 'apollo-server-core';

import { getTableWithUsers } from '../utils/relationMapper';
import database from '../database';

export const typeDefs = gql`
  extend type Query {
    label(id: ID!): Label!
    labels: [Label!]
  }

  extend type Mutation {
    createLabel(input: LabelInput!): Label!

    deleteLabelById(user_id: ID!, label_id: ID!): Boolean
    deleteLabelByName(username: String!, label_name: String!): Boolean

    destroyLabelById(user_id: ID!, label_id: ID!): Boolean
    destroyLabelByName(username: String!, label_name: String!): Boolean
  }

  input LabelInput {
    label_name: String!
  }

  type Label {
    id: ID!
    label_name: String!
    users: [User!]
    created_at: String!
    updated_at: String
    deleted_at: String
  }
`;

export const resolvers = {
  Query: {
    label: async (_, args) => {
      const label = await database.models.label.findByPk(args.id, { where: { deleted_at: null } });
      return getTableWithUsers(label);
    },

    labels: async () => {
      const labels = await database.models.label.findAll({ where: { deleted_at: null } });
      return labels.map(getTableWithUsers);
    },
  },
  Mutation: {
    createLabel: async (_, { input: args }) => {
      const labelExist = await database.models.label.findOne({ where: { label_name: args.label_name, deleted_at: null } });
      if (labelExist) throw new Error('Label already exist');

      const label = await database.models.label.create({ label_name: args.label_name /* label_display_name: args.label_display_name */ });
      return getTableWithUsers(label);
    },

    deleteLabelById: async (_, args) => {
      const user = await database.models.user.findByPk(args.user_id, { where: { deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const label = await database.models.label.findByPk(args.id, { where: { deleted_at: null } });
      if (!label) throw new Error("Label doesn't exist.");

      const labelUsers = await label.getUsers();
      if (labelUsers.length > 0) throw new Error('Label contains users.');

      await label.update({ deleted_at: Date.now() });
      return true;
    },

    deleteLabelByName: async (_, args) => {
      const user = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const label = await database.models.label.findOne({ where: { label_name: args.label_name, deleted_at: null } });
      if (!label) throw new Error("Label doesn't exist.");

      const labelUsers = await label.getUsers();
      if (labelUsers.length > 0) throw new Error('Label contains users.');

      await label.update({ deleted_at: Date.now() });
      return true;
    },

    destroyLabelById: async (_, args) => {
      const user = await database.models.user.findByPk(args.user_id, { where: { deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const label = await database.models.label.findByPk(args.id);
      if (!label) throw new Error("Label doesn't exist.");

      const labelUsers = await label.getUsers();
      if (labelUsers.length > 0) throw new Error('Label contains users.');

      await label.destroy();
      return true;
    },

    destroyLabelByName: async (_, args) => {
      const user = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const label = await database.models.label.findOne({ where: { label_name: args.label_name } });
      if (!label) throw new Error("Label doesn't exist.");

      const labelUsers = await label.getUsers();
      if (labelUsers.length > 0) throw new Error('Label contains users.');

      await label.destroy();
      return true;
    },
  },
};
