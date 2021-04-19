import { ForbiddenError, gql, UserInputError } from 'apollo-server-core';

import errors from '../config/errors';
import database from '../database';

import { getObjectWithUsers } from '../utils/relationMapper';
import { checkIsAdmin } from '../utils/authorization';
import { subject as subjectShortcut, user as userShortcut } from '../utils/shortcut';

export const typeDefs = gql`
  extend type Query {
    subject(id: ID!): Subject!
    subjects: [Subject!]
  }

  extend type Mutation {
    createSubject(input: SubjectInput): Subject!

    deleteSubject(id: ID!): Boolean

    destroySubject(id: ID!): Boolean
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
    subject: async (_parent, args) => {
      const subject = await subjectShortcut.find(args.subject_id);
      return subject ? getObjectWithUsers(subject) : null;
    },

    subjects: async () => {
      const subjects = await subjectShortcut.findAll();
      return subjects.map(getObjectWithUsers);
    },
  },
  Mutation: {
    createSubject: async (_parent, { input: args }, context) => {
      if (!context?.id) throw new ForbiddenError(errors.NOT_ALLOWED);

      const loggedUser = await userShortcut.findWithRole(context.id);
      await checkIsAdmin(loggedUser);

      const subjectExist = await subjectShortcut.findByName(args.subject_name);
      if (subjectExist) throw new UserInputError(errors.SUBJECT_DUPLICATION);

      const subject = await subjectShortcut.create({ subject_name: args.subject_name });
      return getObjectWithUsers(subject);
    },

    deleteSubject: async (_parent, args, context) => {
      if (!context?.id) throw new ForbiddenError(errors.NOT_ALLOWED);

      const loggedUser = await userShortcut.findWithRole(context.id);
      await checkIsAdmin(loggedUser);

      const subject = await subjectShortcut.find(args.id, database.models.user);
      if (!subject) throw new UserInputError(errors.DEFAULT);

      if (subject?.users.length > 0) throw new UserInputError(errors.SUBJECT_CASCADE);

      await subject.update({ deleted_at: Date.now() });
      return true;
    },

    destroySubject: async (_parent, args, context) => {
      if (!context?.id) throw new ForbiddenError(errors.NOT_ALLOWED);

      const loggedUser = await userShortcut.findWithRole(context.id);
      await checkIsAdmin(loggedUser);

      const subject = await subjectShortcut.findDeleted(args.id, database.models.user);
      if (!subject) throw new UserInputError(errors.DEFAULT);

      if (subject?.users.length > 0) throw new UserInputError(errors.SUBJECT_CASCADE);

      await subject.destroy();
      return true;
    },
  },
};
