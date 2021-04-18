import { gql } from 'apollo-server-core';

import errors from '../config/errors';
import database from '../database';

import { getTableWithUsers } from '../utils/relationMapper';

// TODO: [ ] Check if user have the deleted or destroyed role.

export const typeDefs = gql`
  extend type Query {
    role(id: ID!): Role!
    roles: [Role!]
  }

  extend type Mutation {
    createRole(input: RoleInput): Role!

    deleteRoleById(role_id: ID!): Boolean
    deleteRoleByName(role_name: String!): Boolean

    destroyRoleById(role_id: ID!): Boolean
    destroyRoleByName(role_name: String!): Boolean
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
      const role = await database.models.role.findByPk(args.id, { where: { deleted_at: null } });
      return getTableWithUsers(role);
    },

    roles: async () => {
      const roles = await database.models.role.findAll({ where: { deleted_at: null } });
      return roles.map(getTableWithUsers);
    },
  },
  Mutation: {
    createRole: async (_parent, { input: args }) => {
      const roleExist = await database.models.role.findOne({ where: { role_name: args.role_name, deleted_at: null } });
      if (roleExist) throw new Error(errors.ROLE_DUPLICATION);

      const role = await database.models.role.create({ role_name: args.role_name });
      return getTableWithUsers(role);
    },

    deleteRoleById: async (_parent, args) => {
      const role = await database.models.role.findByPk(args.role_id);
      if (!role) throw new Error(errors.DEFAULT);

      await role.update({ deleted_at: null });
      return true;
    },

    deleteRoleByName: async (_parent, args) => {
      const role = await database.models.role.findOne({ where: { role_name: args.role_name, deleted_at: null } });
      if (!role) throw new Error(errors.DEFAULT);

      await role.update({ deleted_at: null });
      return true;
    },

    destroyRoleById: async (_parent, args) => {
      const role = await database.models.role.findByPk(args.role_id);
      if (!role) throw new Error(errors.DEFAULT);

      await role.destroy();
      return true;
    },

    destroyRoleByName: async (_parent, args) => {
      const role = await database.models.role.findOne({ where: { role_name: args.role_name, deleted_at: null } });
      if (!role) throw new Error(errors.DEFAULT);

      await role.destroy();
      return true;
    },
  },
};
