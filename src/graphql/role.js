import { AuthenticationError, gql, UserInputError } from 'apollo-server-core';

import errors from '../config/errors';

import { getTableWithUsers } from '../utils/relationMapper';

import { checkIsAdmin } from '../utils/authorization';
import { role as roleShortcut, user as userShortcut } from '../utils/shortcut';

// TODO: [ ] Check if user have the deleted or destroyed role.

export const typeDefs = gql`
  extend type Query {
    role(id: ID!): Role!
    roles: [Role!]
  }

  extend type Mutation {
    createRole(input: RoleInput): Role!

    deleteRole(id: ID!): Boolean

    destroyRole(id: ID!): Boolean
  }

  input RoleInput {
    role_name: String!
  }

  type Role {
    id: ID!
    role_name: String!
    users: [User!]
    created_at: String!
    updated_at: String
    deleted_at: String
  }
`;

export const resolvers = {
  Query: {
    role: async (_parent, args) => {
      const role = await roleShortcut.find(args.id);
      return getTableWithUsers(role);
    },

    roles: async () => {
      const roles = await roleShortcut.findAll();
      return roles.map(getTableWithUsers);
    },
  },
  Mutation: {
    createRole: async (_parent, { input: args }, context) => {
      if (!context?.id) throw new AuthenticationError(errors.NOT_ALLOWED);

      const user = await userShortcut.find(context.id);
      await checkIsAdmin(user);

      const roleExist = await roleShortcut.findByName(args.role_name);
      if (roleExist) throw new UserInputError(errors.ROLE_DUPLICATION);

      const role = await roleShortcut.create({ role_name: args.role_name });
      return getTableWithUsers(role);
    },

    deleteRole: async (_parent, args, context) => {
      if (!context?.id) throw new AuthenticationError(errors.NOT_ALLOWED);

      const user = await userShortcut.find(context.id);
      await checkIsAdmin(user);

      const role = await roleShortcut.find(args.id);
      if (!role) throw new UserInputError(errors.DEFAULT);

      await role.update({ deleted_at: null });
      return true;
    },

    destroyRole: async (_parent, args, context) => {
      if (!context?.id) throw new AuthenticationError(errors.NOT_ALLOWED);

      const user = await userShortcut.find(context.id);
      await checkIsAdmin(user);

      const role = await roleShortcut.findDeleted(args.id);
      if (!role) throw new UserInputError(errors.DEFAULT);

      await role.destroy();
      return true;
    },
  },
};
