import { gql } from 'apollo-server-core';

import database from '../database';
import { getTableWithUsers } from '../utils/relationMapper';

export const typeDefs = gql`
  extend type Query {
    role(id: ID!): Role!
    roles: [Role!]
  }

  extend type Mutation {
    createRole(input: RoleInput): Role!
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
    role: async (_, args) => {
      const role = await database.models.role.findByPk(args.id);
      return getTableWithUsers(role);
    },

    roles: async () => {
      const roles = await database.models.role.findAll();
      return roles.map(getTableWithUsers);
    },
  },
  Mutation: {
    createRole: async (_, { input: args }) => {
      const roleExist = await database.models.role.findOne({ where: { role_name: args.role_name } });
      if (roleExist) throw new Error('Role already exist');

      const role = await database.models.role.create({ role_name: args.role_name });
      return getTableWithUsers(role);
    },

    destroyRoleById: async (_, args) => {
      const role = await database.models.role.findByPk(args.role_id);
      if (!role) throw new Error("Role does't exist.");

      await role.destroy();
      return true;
    },

    destroyRoleByName: async (_, args) => {
      const role = await database.models.role.findOne({ where: { role_name: args.role_name } });
      if (!role) throw new Error("Role does't exist.");

      await role.destroy();
      return true;
    },
  },
};
