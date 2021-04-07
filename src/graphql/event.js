import { gql } from 'apollo-server-core';

import database from '../database';
import { eventObject } from '../utils/relationMapper';

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
    user_id: String!
    label_id: String!
    subject_id: String!
  }

  input EventInputByName {
    start: String!
    link: String
    username: String!
    label_name: String!
    subject_name: String!
  }

  type Event {
    id: ID!
    start: String!
    link: String
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
      const event = await database.models.event.findOne({
        where: { id: args.id },
        include: [database.models.label, database.models.subject, database.models.user],
      });

      return eventObject(event);
    },

    events: async () => {
      const events = await database.models.event.findAll({ include: [database.models.label, database.models.subject, database.models.user] });
      return events.map(eventObject);
    },
  },

  Mutation: {
    // TODO : Verify permissions of user when creating the event (subject owning etc...)
    // TODO : Set relation mapping.

    createEventById: async (_, { input: args }) => {
      const startDate = new Date(args.start);

      const user = await database.models.user.findOne({ where: { id: args.user_id } });
      if (!user) throw new Error("User does't exist.");

      const label = await database.models.label.findOne({ where: { id: args.label_id } });
      if (!label) throw new Error("Label does't exist.");

      const subject = await database.models.subject.findOne({ where: { id: args.subject_id } });
      if (!subject) throw new Error("Subject does't exist.");

      const event = await database.models.event.create({
        start: startDate,
        link: args.link ? args.link : '',
      });

      return eventObject(event);
    },

    createEventByName: async (_, { input: args }) => {
      const startDate = new Date(args.start);

      const user = await database.models.user.findOne({ where: { username: args.username } });
      if (!user) throw new Error("User does't exist.");

      const label = await database.models.label.findOne({ where: { label_name: args.label_name } });
      if (!label) throw new Error("Label does't exist.");

      const subject = await database.models.subject.findOne({ where: { subject_name: args.subject_name } });
      if (!subject) throw new Error("Subject does't exist.");

      const event = await database.models.event.create({ start: startDate, link: args.link ? args.link : '' });
      await event.setLabel(label);
      await event.setSubject(subject);
      await event.setUser(user);

      return eventObject(event);
    },
  },
};
