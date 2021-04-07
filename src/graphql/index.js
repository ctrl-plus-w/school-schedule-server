import { merge } from 'lodash';
import { gql } from 'apollo-server-core';

import { typeDefs as User, resolver as userResolvers } from './user';
import { typeDefs as Label, resolvers as labelResolvers } from './label';
import { typeDefs as Auth, resolvers as authResolvers } from './auth';
import { typeDefs as Role, resolvers as roleResolvers } from './role';
import { typeDefs as Subject, resolvers as subjectResolvers } from './subject';
import { typeDefs as Event, resolvers as eventResolvers } from './event';
import { typeDefs as Test, resolvers as testResolvers } from './test';

const Query = gql`
  type Query {
    _empty: String
  }
`;

const Mutation = gql`
  type Mutation {
    _empty: String
  }
`;

export const typeDefs = [Query, Mutation, User, Label, Auth, Role, Subject, Event, Test];
export const resolvers = merge(userResolvers, labelResolvers, authResolvers, roleResolvers, subjectResolvers, eventResolvers, testResolvers);
