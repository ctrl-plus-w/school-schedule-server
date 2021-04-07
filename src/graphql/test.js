import { gql } from 'apollo-server-core';

import database from '../database';
import { formatDbObject } from '../utils/utils';

export const typeDefs = gql`
  extend type Query {
    test: [User!]
  }
`;

export const resolvers = {
  Query: {
    test: async () => {
      const users = await database.models.user.findAll();

      return users.map((u) => ({
        ...formatDbObject(u),
        labels: async () => {
          const labels = await u.getLabels();
          console.log(labels);
          return labels;
        },
      }));
    },
  },
};
