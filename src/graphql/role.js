import { gql } from 'apollo-server-core';

import database from '../database';
import { formatDbObject, translateDate } from '../utils/utils';

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

const getRole = async (user) => {
  const role = await user.getRole();
  if (!role) return null;

  return { ...role, users: () => getUsers(role) };
};

const getUsers = async (role) => {
  const users = await role.getUsers();
  if (!users) return [];

  return users.map((user) => ({ ...user, role: () => getRole(user) }));
};

export const resolvers = {
  Query: {
    role: async (_, args) => {
      const role = await database.models.role.findOne({ where: { id: args.id } });
      return { ...formatDbObject(role), users: () => getUsers(role) };
    },

    roles: async () => {
      const roles = await database.models.role.findAll();
      return roles.map((role) => ({ ...formatDbObject(role), users: () => getUsers(role) }));
    },
  },
  Mutation: {
    createRole: async (_, { input: args }) => {
      const roleExist = await database.models.role.findOne({ where: { role_name: args.role_name } });
      if (roleExist) throw new Error('Role already exist');

      const createdRole = await database.models.role.create({ role_name: args.role_name });
      return createdRole;
    },

    destroyRoleById: async (_, args) => {
      const role = await database.models.role.findOne({ where: { id: args.role_id } });
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
