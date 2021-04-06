import { gql } from 'apollo-server-core';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import config from '../config';
import database from '../database';

export const typeDefs = gql`
  extend type Query {
    login(username: String!, password: String!): AuthData!
  }

  type AuthData {
    id: ID!
    token: String!
    token_expiration: Int!
  }
`;

export const resolvers = {
  Query: {
    login: async (_, args) => {
      const user = await database.models.user.findOne({ where: { username: args.username } });
      if (!user) throw new Error("User doesn't exists.");

      console.log(user);

      const isPasswordValid = await bcrypt.compare(args.password, user.password);
      if (!isPasswordValid) throw new Error('Password is invalid.');

      const token = jwt.sign(
        {
          user_id: user.id,
          username: user.username,
          full_name: user.full_name,
        },
        config.JWT_KEY,
        {
          expiresIn: `${config.JWT_TOKEN_EXPIRATION}h`,
        }
      );

      return {
        id: user.id,
        token: token,
        token_expiration: config.JWT_TOKEN_EXPIRATION,
      };
    },
  },
};
