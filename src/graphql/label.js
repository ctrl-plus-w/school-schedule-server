import { gql } from 'apollo-server-core';

import errors from '../config/errors';
import database from '../database';

import { getObjectWithUsers } from '../utils/relationMapper';

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
    label: async (_parent, args) => {
      const label = await database.models.label.findByPk(args.id, { where: { deleted_at: null } });
      return getObjectWithUsers(label);
    },

    labels: async () => {
      const labels = await database.models.label.findAll({ where: { deleted_at: null } });
      return labels.map(getObjectWithUsers);
    },
  },

  Mutation: {
    createLabel: async (_parent, { input: args }) => {
      const labelExist = await database.models.label.findOne({ where: { label_name: args.label_name, deleted_at: null } });
      if (labelExist) throw new Error(errors.LABEL_DUPLICATION);

      const label = await database.models.label.create({ label_name: args.label_name /* label_display_name: args.label_display_name */ });
      return getObjectWithUsers(label);
    },

    deleteLabelById: async (_parent, args) => {
      const user = await database.models.user.findByPk(args.user_id, { where: { deleted_at: null } });
      if (!user) throw new Error(errors.DEFAULT);

      const label = await database.models.label.findByPk(args.id, { where: { deleted_at: null } });
      if (!label) throw new Error(errors.DEFAULT);

      const labelUsers = await label.getUsers();
      if (labelUsers.length > 0) throw new Error(errors.LABEL_CASCADE);

      await label.update({ deleted_at: Date.now() });
      return true;
    },

    deleteLabelByName: async (_parent, args) => {
      const user = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (!user) throw new Error(errors.DEFAULT);

      const label = await database.models.label.findOne({ where: { label_name: args.label_name, deleted_at: null } });
      if (!label) throw new Error(errors.DEFAULT);

      const labelUsers = await label.getUsers();
      if (labelUsers.length > 0) throw new Error(errors.LABEL_CASCADE);

      await label.update({ deleted_at: Date.now() });
      return true;
    },

    destroyLabelById: async (_parent, args) => {
      const user = await database.models.user.findByPk(args.user_id, { where: { deleted_at: null } });
      if (!user) throw new Error(errors.DEFAULT);

      const label = await database.models.label.findByPk(args.id);
      if (!label) throw new Error(errors.DEFAULT);

      const labelUsers = await label.getUsers();
      if (labelUsers.length > 0) throw new Error(errors.LABEL_CASCADE);

      await label.destroy();
      return true;
    },

    destroyLabelByName: async (_parent, args) => {
      const user = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (!user) throw new Error(errors.DEFAULT);

      const label = await database.models.label.findOne({ where: { label_name: args.label_name } });
      if (!label) throw new Error(errors.DEFAULT);

      const labelUsers = await label.getUsers();
      if (labelUsers.length > 0) throw new Error(errors.LABEL_CASCADE);

      await label.destroy();
      return true;
    },
  },
};
