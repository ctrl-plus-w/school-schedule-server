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
    destroyLabelById(label_id: ID!): Boolean
    destroyLabelByName(label_name: String!): Boolean
  }

  input LabelInput {
    label_name: String!
    # label_display_name: String!
  }

  type Label {
    id: ID!
    label_name: String!
    # label_display_name: String!
    users: [User!]
    created_at: String!
    updated_at: String
    deleted_at: String
  }
`;

export const resolvers = {
  Query: {
    label: async (_, args) => {
      const label = await database.models.label.findOne({ where: { id: args.id } });
      return getTableWithUsers(label);
    },

    labels: async () => {
      const labels = await database.models.label.findAll({ include: [{ model: database.models.user }] });
      return labels.map(getTableWithUsers);
    },
  },
  Mutation: {
    createLabel: async (_, { input: args }) => {
      const labelExist = await database.models.label.findOne({ where: { label_name: args.label_name } });
      if (labelExist) throw new Error('Label already exist');

      const label = await database.models.label.create({ label_name: args.label_name /* label_display_name: args.label_display_name */ });
      return getTableWithUsers(label);
    },

    destroyLabelById: async (_, args) => {
      const label = await database.models.label.findOne({ where: { id: args.id } });
      if (!label) throw new Error("Label doesn't exist.");

      await label.destroy();
      return true;
    },

    destroyLabelByName: async (_, args) => {
      const label = await database.models.label.findOne({ where: { id: args.label_name } });
      if (!label) throw new Error("Label doesn't exist.");

      await label.destroy();
      return true;
    },
  },
};
