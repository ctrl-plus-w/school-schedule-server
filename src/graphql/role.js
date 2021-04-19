import { AuthenticationError, gql, UserInputError } from 'apollo-server-core';

import errors from '../config/errors';
import database from '../database';

import { getObjectWithUsers } from '../utils/relationMapper';

import { checkIsAdmin } from '../utils/authorization';
import { role as roleShortcut, user as userShortcut } from '../utils/shortcut';

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
      return getObjectWithUsers(role);
    },

    roles: async () => {
      const roles = await roleShortcut.findAll();
      return roles.map(getObjectWithUsers);
    },
  },
  Mutation: {
    createRole: async (_parent, { input: args }, context) => {
      if (!context?.id) throw new AuthenticationError(errors.NOT_ALLOWED);

      const loggedUser = await userShortcut.findWithRole(context.id);
      await checkIsAdmin(loggedUser);

      const roleExist = await roleShortcut.findByName(args.role_name);
      if (roleExist) throw new UserInputError(errors.ROLE_DUPLICATION);

      const role = await roleShortcut.create({ role_name: args.role_name });
      return getObjectWithUsers(role);
    },

    deleteRole: async (_parent, args, context) => {
      if (!context?.id) throw new AuthenticationError(errors.NOT_ALLOWED);

      const loggedUser = await userShortcut.findWithRole(context.id);
      await checkIsAdmin(loggedUser);

      const role = await roleShortcut.find(args.id, database.models.user);
      if (!role) throw new UserInputError(errors.DEFAULT);

      if (role?.users.length > 0) throw new UserInputError(errors.ROLE_CASCADE);

      await role.update({ deleted_at: null });
      return true;
    },

    destroyRole: async (_parent, args, context) => {
      if (!context?.id) throw new AuthenticationError(errors.NOT_ALLOWED);

      const loggedUser = await userShortcut.findWithRole(context.id);
      await checkIsAdmin(loggedUser);

      const role = await roleShortcut.findDeleted(args.id, database.models.user);
      if (!role) throw new UserInputError(errors.DEFAULT);

      if (role?.users.length > 0) throw new UserInputError(errors.ROLE_CASCADE);

      await role.destroy();
      return true;
    },
  },
};
