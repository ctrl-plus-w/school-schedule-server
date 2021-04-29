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

    verifyToken: AuthData!
  }

  type AuthData {
    id: ID!
    role: String!
    full_name: String!
    token: String!
    subjects: [Subject]!
    labels: [Label]!
  }
`;

export const resolvers = {
  Mutation: {
    login: async (_parent, args) => {
      const user = await userShortcut.findByUsername(args.username, [database.models.role, database.models.label, database.models.subject]);
      if (!user) throw new AuthenticationError(errors.BAD_CREDENTIAL);

      const isPasswordValid = await bcrypt.compare(args.password, user.password);
      if (!isPasswordValid) throw new AuthenticationError(errors.BAD_CREDENTIAL);

      const payload = { id: user.id, role: user.role.role_name, full_name: user.full_name, subjects: user.subjects, labels: user.labels };
      const options = { expiresIn: `${config.JWT_TOKEN_EXPIRATION}h` };

      const token = jwt.sign(payload, config.JWT_KEY, options);

      return { ...payload, token };
    },

    verifyToken: async (_parent, _args, context) => {
      if (!context.auth) throw new Error(errors.NOT_ALLOWED);

      return {
        id: context.id,
        role: context.role,
        full_name: context.full_name,
        token: context.token,
        labels: context.labels,
        subjects: context.subjects,
      };
    },
  },
};
