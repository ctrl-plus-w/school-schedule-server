import { AuthenticationError, gql, UserInputError } from 'apollo-server-core';

import errors from '../config/errors';
import database from '../database';

import { label as labelShortcut, user as userShortcut } from '../utils/shortcut';
import { getObjectWithUsers } from '../utils/relationMapper';
import { checkIsAdmin } from '../utils/authorization';

export const typeDefs = gql`
  extend type Query {
    label(id: ID!): Label!
    labels: [Label!]
  }

  extend type Mutation {
    createLabel(input: LabelInput!): Label!

    deleteLabel(id: ID!): Boolean

    destroyLabel(id: ID!): Boolean
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
      const label = await labelShortcut.find(args.id);
      return getObjectWithUsers(label);
    },

    labels: async () => {
      const labels = await labelShortcut.findAll();
      return labels.map(getObjectWithUsers);
    },
  },

  Mutation: {
    createLabel: async (_parent, { input: args }, context) => {
      if (!context?.id) throw new AuthenticationError(errors.NOT_ALLOWED);

      const user = await userShortcut.findWithRole(context.id);
      await checkIsAdmin(user);

      const labelExist = await labelShortcut.findByName(args.label_name);
      if (labelExist) throw new UserInputError(errors.LABEL_DUPLICATION);

      const label = await database.models.label.create({ label_name: args.label_name });
      return getObjectWithUsers(label);
    },

    deleteLabel: async (_parent, args, context) => {
      if (!context?.id) throw new AuthenticationError(errors.NOT_ALLOWED);

      const user = await userShortcut.findWithRole(context.id);
      await checkIsAdmin(user);

      const label = await labelShortcut.find(args.id, database.models.user);
      if (!label) throw new UserInputError(errors.DEFAULT);

      if (label?.users.length > 0) throw new UserInputError(errors.LABEL_CASCADE);

      await label.update({ deleted_at: Date.now() });
      return true;
    },

    destroyLabel: async (_parent, args, context) => {
      if (!context?.id) throw new AuthenticationError(errors.NOT_ALLOWED);

      const user = await userShortcut.findWithRole(context.id);
      await checkIsAdmin(user);

      const label = await labelShortcut.find(args.id, database.models.user);
      if (!label) throw new UserInputError(errors.DEFAULT);

      if (label?.users.length > 0) throw new UserInputError(errors.LABEL_CASCADE);

      await label.destroy();
      return true;
    },
  },
};
