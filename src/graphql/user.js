import { gql } from 'apollo-server-core';
import bcrypt from 'bcrypt';

import { formatDbObject } from '../utils/utils';
import database from '../database';

export const typeDefs = gql`
  extend type Query {
    user(id: ID!): User!
    users: [User!]
  }

  extend type Mutation {
    createUser(input: UserInput!): User
    addLabel(userId: ID!, labelId: ID!): Boolean
  }

  input UserInput {
    username: String!
    full_name: String!
    password: String!
  }

  type User {
    id: ID!
    username: String!
    full_name: String!
    password: String!
    labels: [Label!]
    created_at: String!
    updated_at: String
    deleted_at: String
  }
`;

// TODO : Fix nesting of label in user and user in label.

export const resolver = {
  Query: {
    user: async (_, args) => {
      const user = await database.models.user.findOne({ where: { id: args.id } });
      return formatDbObject(user);
    },

    users: async () => {
      const users = await database.models.user.findAll({ include: [{ model: database.models.label }] });
      return users.map(async (user) => formatDbObject(user));
    },
  },

  Mutation: {
    createUser: async (_, { input: args }) => {
      const userExists = await database.models.user.findOne({ where: { username: args.username } });
      if (userExists) throw new Error('User already exists.');

      const cryptedPassword = bcrypt.hashSync(args.password, 12);

      const createdUser = await database.models.user.create({
        username: args.username,
        full_name: args.full_name,
        password: cryptedPassword,
      });

      return formatDbObject(createdUser);
    },

    addLabel: async (_, args) => {
      const user = await database.models.user.findOne({ where: { id: args.userId } });
      if (!user) throw new Error("User doesn't exists.");

      const label = await database.models.label.findOne({ where: { id: args.labelId } });
      if (!label) throw new Error("Label doesn't exists.");

      const addedLabel = await user.addLabel(label);

      console.log(addedLabel);

      return true;
    },
  },
};
