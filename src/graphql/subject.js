import { gql } from 'apollo-server-core';

import database from '../database';
import { formatDbObject } from '../utils/utils';

import { getLabels, getUsers, getRole, getSubjects } from '../utils/relationMapper';

export const typeDefs = gql`
  extend type Query {
    subject(id: ID!): Subject!
    subjects: [Subject!]
  }

  extend type Mutation {
    createSubject(input: SubjectInput): Subject!
    destroySubjectById(subject_id: ID!): Boolean
    destroySubjectByName(subject_name: String!): Boolean
  }

  input SubjectInput {
    subject_name: String!
  }

  type Subject {
    id: ID!
    subject_name: String!
    users: [User!]
    created_at: String!
    updated_at: String
    deleted_at: String
  }
`;

export const resolvers = {
  Query: {
    subject: async (_, args) => {
      const subject = await database.models.subject.findOne({ where: { id: args.id } });
      return subject ? { ...formatDbObject(subject), users: () => getUsers(subject) } : null;
    },

    subjects: async () => {
      const subjects = await database.models.subject.findAll();
      return subjects.map((s) => ({ ...formatDbObject(s), users: () => getUsers(s) }));
    },
  },
  Mutation: {
    createSubject: async (_, { input: args }) => {
      const subjectExist = await database.models.subject.findOne({ where: { subject_name: args.subject_name } });
      if (subjectExist) throw new Error('Subject already exist.');

      const subject = await database.models.subject.create({ subject_name: args.subject_name });
      return { ...formatDbObject(subject), users: () => getUsers(subject) };
    },

    destroySubjectById: async (_, args) => {
      const subject = await database.models.subject.findOne({ where: { id: args.subject_id } });
      if (!subject) throw new Error("Subject does't exist.");

      await subject.destroy();
      return true;
    },

    destroySubjectByName: async (_, args) => {
      const subject = await database.models.subject.findOne({ where: { subject_name: args.subject_name } });
      if (!subject) throw new Error("Subject does't exist.");

      await subject.destroy();
      return true;
    },
  },
};
