import { gql } from 'apollo-server-core';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import config from '../config';
import errors from '../config/errors';
import database from '../database';

export const typeDefs = gql`
  extend type Mutation {
    login(username: String!, password: String!): AuthData!
  }

  type AuthData {
    id: ID!
    role: String!
    full_name: String!
    token: String!
    token_expiration: Int!
  }
`;

export const resolvers = {
  Mutation: {
    login: async (_parent, args) => {
      const user = await database.models.user.findOne({ where: { username: args.username, deleted_at: null }, include: database.models.role });
      if (!user) throw new Error(errors.BAD_CREDENTIAL);

      const isPasswordValid = await bcrypt.compare(args.password, user.password);
      if (!isPasswordValid) throw new Error(errors.BAD_CREDENTIAL);
      const token = jwt.sign(
        {
          id: user.id,
          role: { id: user.role.id, role_name: user.role.role_name },
        },
        config.JWT_KEY,
        {
          expiresIn: `${config.JWT_TOKEN_EXPIRATION}h`,
        }
      );

      const userJSON = user.toJSON();

      return {
        id: userJSON.id,
        role: userJSON.role.role_name,
        full_name: userJSON.full_name,
        token: token,
        token_expiration: config.JWT_TOKEN_EXPIRATION,
      };
    },
  },
};
