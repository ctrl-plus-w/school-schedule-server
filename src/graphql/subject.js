import { gql } from 'apollo-server-core';

import database from '../database';

import { getTableWithUsers } from '../utils/relationMapper';

export const typeDefs = gql`
  extend type Query {
    subject(id: ID!): Subject!
    subjects: [Subject!]
  }

  extend type Mutation {
    createSubject(input: SubjectInput): Subject!

    deleteSubjectById(subject_id: ID!): Boolean
    deleteSubjectByName(subject_name: String!): Boolean

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
      const subject = await database.models.subject.findByPk(args.id, { where: { deleted_at: null } });
      return subject ? getTableWithUsers(subject) : null;
    },

    subjects: async () => {
      const subjects = await database.models.subject.findAll({ where: { deleted_at: null } });
      return subjects.map(getTableWithUsers);
    },
  },
  Mutation: {
    createSubject: async (_, { input: args }) => {
      const subjectExist = await database.models.subject.findOne({ where: { subject_name: args.subject_name, deleted_at: null } });
      if (subjectExist) throw new Error('Subject already exist.');

      const subject = await database.models.subject.create({ subject_name: args.subject_name, deleted_at: null });
      return getTableWithUsers(subject);
    },

    deleteSubjectById: async (_, args) => {
      const subject = await database.models.subject.findByPk(args.subject_id, { where: { deleted_at: null } });
      if (!subject) throw new Error("Subject does't exist.");

      const subjectUsers = await subject.getUsers();
      if (subjectUsers.length > 0) throw new Error('Subject contains users.');

      await subject.update({ deleted_at: Date.now() });
      return true;
    },

    deleteSubjectByName: async (_, args) => {
      const subject = await database.models.subject.findOne({ where: { subject_name: args.subject_name, deleted_at: null } });
      if (!subject) throw new Error("Subject does't exist.");

      const subjectUsers = await subject.getUsers();
      if (subjectUsers.length > 0) throw new Error('Subject contains users.');

      await subject.update({ deleted_at: Date.now() });
      return true;
    },

    destroySubjectById: async (_, args) => {
      const subject = await database.models.subject.findByPk(args.subject_id);
      if (!subject) throw new Error("Subject does't exist.");

      const subjectUsers = await subject.getUsers();
      if (subjectUsers.length > 0) throw new Error('Subject contains users.');

      await subject.destroy();
      return true;
    },

    destroySubjectByName: async (_, args) => {
      const subject = await database.models.subject.findOne({ where: { subject_name: args.subject_name } });
      if (!subject) throw new Error("Subject does't exist.");

      const subjectUsers = await subject.getUsers();
      if (subjectUsers.length > 0) throw new Error('Subject contains users.');

      await subject.destroy();
      return true;
    },
  },
};