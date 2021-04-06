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
  }

  input RoleInput {
    role_name: String!
  }

  type Role {
    id: ID!
    role_name: String!
    created_at: String!
    updated_at: String
    deleted_at: String
  }
`;

export const resolvers = {
  Query: {
    role: async (_, args) => {
      const roles = await database.models.role.findOne({ where: { id: args.id } });
      return formatDbObject(roles);
    },

    roles: async () => {
      const roles = await database.models.role.findAll();
      return roles.map((role) => formatDbObject(role));
    },
  },
  Mutation: {
    createRole: async (_, { input: args }) => {
      const roleExists = await database.models.role.findOne({ where: { role_name: args.role_name } });
      if (roleExists) throw new Error('Role already exists');

      const createdRole = await database.models.role.create({ role_name: args.role_name });
      return createdRole;
    },
  },
};
