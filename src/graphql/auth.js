import { gql, AuthenticationError } from 'apollo-server-core';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { user as userShortcut } from '../utils/shortcut';

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
      const user = await userShortcut.findByUsername(args.username, [database.models.role]);
      if (!user) throw new AuthenticationError(errors.BAD_CREDENTIAL);

      const isPasswordValid = await bcrypt.compare(args.password, user.password);
      if (!isPasswordValid) throw new AuthenticationError(errors.BAD_CREDENTIAL);

      const payload = { id: user.id, role: { id: user.role.id, role_name: user.role.role_name } };
      const options = { expiresIn: `${config.JWT_TOKEN_EXPIRATION}h` };

      const token = jwt.sign(payload, config.JWT_KEY, options);
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
