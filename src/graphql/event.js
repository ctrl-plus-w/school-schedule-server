import { gql } from 'apollo-server-core';

import database from '../database';
import { eventObject } from '../utils/relationMapper';

import config from '../config';

export const typeDefs = gql`
  extend type Query {
    event(id: ID!): Event
    events: [Event!]
  }

  extend type Mutation {
    createEventById(input: EventInputById): Event
    createEventByName(input: EventInputByName): Event
  }

  input EventInputById {
    start: String!
    link: String
    obligatory: Boolean!
    user_id: String!
    label_id: String!
    subject_id: String!
  }

  input EventInputByName {
    start: String!
    link: String
    obligatory: Boolean!
    username: String!
    label_name: String!
    subject_name: String!
  }

  type Event {
    id: ID!
    start: String!
    link: String
    obligatory: Boolean!
    owner: User
    label: Label
    subject: Subject
    created_at: String!
    updated_at: String
    deleted_at: String
  }
`;

export const resolvers = {
  Query: {
    event: async (_, args) => {
      const event = await database.models.event.findByPk(args.id);
      return eventObject(event);
    },

    events: async () => {
      const events = await database.models.event.findAll();
      return events.map(eventObject);
    },
  },

  Mutation: {
    // TODO : [x] Verify permissions of user when creating the event (subject owning etc...)
    // TODO : [ ] Set the role detection into the jwt and the request.
    // TODO : [ ] Verify if there is already a class for this label at this time.
    // TODO : [ ] Redefined error messages.

    createEventById: async (_, { input: args }) => {
      const startDate = new Date(args.start);

      const user = await database.models.user.findByPk(args.user_id, { include: [database.models.role, database.models.subject] });

      if (!user) throw new Error("User does't exist.");
      if (!user.role) throw new Error('User must have a role.');
      if (!user.subjects) throw new Error('User must own at least one subject.');

      const label = await database.models.label.findByPk(args.label_id);
      if (!label) throw new Error("Label does't exist.");

      const subject = await database.models.subject.findByPk(args.subject_id);
      if (!subject) throw new Error("Subject does't exist.");

      const professorRole = await database.models.role.findOne({ where: { role_name: config.ROLES.PROFESSOR } });
      if (!professorRole) throw new Error('Professor role not defined.');

      const isUserProfessor = professorRole.toJSON().id === user.toJSON().role.id;
      if (!isUserProfessor) throw new Error('User must have the professor role.');

      const userOwnSubject = await user.hasSubject(subject);
      if (!userOwnSubject) throw new Error('User must own the subject.');

      const event = await database.models.event.create({ start: startDate, link: args.link ? args.link : '', obligatory: args.obligatory });
      await event.setLabel(label);
      await event.setSubject(subject);
      await event.setUser(user);

      return eventObject(event);
    },

    createEventByName: async (_, { input: args }) => {
      const startDate = new Date(args.start);

      const eventsCount = await database.models.event.count({ where: { start: startDate } });
      if (eventsCount > 0) throw new Error('An event with this label already exists at this time.');

      const user = await database.models.user.findOne({
        where: { username: args.username },
        include: [database.models.role, database.models.subject],
      });

      if (!user) throw new Error("User does't exist.");
      if (!user.role) throw new Error('User must have a role.');
      if (!user.subjects) throw new Error('User must own at least one subject.');

      const label = await database.models.label.findOne({ where: { label_name: args.label_name } });
      if (!label) throw new Error("Label does't exist.");

      const subject = await database.models.subject.findOne({ where: { subject_name: args.subject_name } });
      if (!subject) throw new Error("Subject does't exist.");

      const professorRole = await database.models.role.findOne({ where: { role_name: config.ROLES.PROFESSOR } });
      if (!professorRole) throw new Error('Professor role not defined.');

      const isUserProfessor = professorRole.toJSON().id === user.toJSON().role.id;
      if (!isUserProfessor) throw new Error('User must have the professor role.');

      const userOwnSubject = await user.hasSubject(subject);
      if (!userOwnSubject) throw new Error('User must own the subject.');

      const event = await database.models.event.create({ start: startDate, link: args.link ? args.link : '', obligatory: args.obligatory });
      await event.setLabel(label);
      await event.setSubject(subject);
      await event.setUser(user);

      return eventObject(event);
    },
  },
};
