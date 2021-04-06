import { gql } from 'apollo-server-core';

import { formatDbObject } from '../utils/utils';
import database from '../database';

export const typeDefs = gql`
  extend type Query {
    label(id: ID!): Label!
    labels: [Label!]
  }

  extend type Mutation {
    createLabel(input: LabelInput!): Label!
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
      const label = await database.models.label.findOne({ where: { id: args.id } });
      return formatDbObject(label);
    },

    labels: async () => {
      const labels = await database.models.label.findAll({ include: [{ model: database.models.user }] });
      return labels.map((label) => formatDbObject(label));
    },
  },
  Mutation: {
    createLabel: async (_, { input: args }) => {
      const labelExists = await database.models.label.findOne({ where: { label_name: args.label_name } });
      if (labelExists) throw new Error('Label already exists');

      const createdLabel = await database.models.label.create({ label_name: args.label_name });
      return formatDbObject(createdLabel);
    },
  },
};
