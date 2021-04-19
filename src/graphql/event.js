/* eslint-disable no-unused-vars */
import { QueryTypes } from 'sequelize';
import { AuthenticationError, ForbiddenError, gql, UserInputError } from 'apollo-server-express';

import moment from 'moment';

import { eventObject } from '../utils/relationMapper';
import {
  user as userShortcut,
  label as labelShortcut,
  role as roleShortcut,
  subject as subjectShortcut,
  event as eventShortcut,
} from '../utils/shortcut';
import { checkIsAdmin, checkIsProfessor } from '../utils/authorization';

import config from '../config';
import errors from '../config/errors';

import database from '../database';

export const typeDefs = gql`
  extend type Query {
    event(id: ID!): Event
    events: [Event!]

    allEvents: [Event!]

    userEvents: [Event!]
    ownedEvents: [Event!]

    labelEvents(id: ID!): [Event!]
  }

  extend type Mutation {
    createEvent(input: EventInput): Event

    deleteEvent(id: ID!): Boolean
    destroyEvent(id: ID!): Boolean
  }

  input EventInput {
    start: String!
    link: String
    description: String!
    obligatory: Boolean!
    label_name: String!
    subject_name: String!
  }

  type Event {
    id: ID!
    start: String!
    link: String
    description: String!
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
      const event = await eventShortcut.find(args.id);
      return eventObject(event);
    },

    events: async () => {
      const events = await eventShortcut.findAll();
      return events.map(eventObject);
    },

    allEvents: async () => {
      const events = await eventShortcut.findAllDeleted();
      return events.map(eventObject);
    },

    userEvents: async (_parent, _args, context) => {
      if (!context?.id) throw new AuthenticationError(errors.NOT_LOGGED);

      const user = await userShortcut.find(context.id, database.models.label);
      if (!user) throw new AuthenticationError(errors.DEFAULT);

      const userLabelIds = user.labels.map((label) => label.id);

      const events = await eventShortcut.findAllByLabelIds(userLabelIds);
      return events.map(eventObject);
    },

    ownedEvents: async (_parent, _args, context) => {
      if (!context?.id) throw new AuthenticationError(errors.NOT_LOGGED);

      const user = await userShortcut.findWithRole(context.id);
      await checkIsProfessor(user);

      const userOwnedEvents = await eventShortcut.findAll({ model: database.models.user, where: { id: context.id } });
      return userOwnedEvents.map(eventObject);
    },

    labelEvents: async (_parent, args, context) => {
      if (!context?.id) throw new AuthenticationError(errors.NOT_LOGGED);

      const user = await userShortcut.findWithRole(context.id);
      await checkIsProfessor(user);

      const labelEvents = await eventShortcut.findAll({ model: database.models.label, where: { id: args.id } });
      return labelEvents.map(eventObject);
    },
  },

  Mutation: {
    // TODO : [x] Verify permissions of user when creating the event (subject owning etc...)
    // TODO : [x] Set the user & role detection into the jwt and the request.
    // TODO : [x] Verify if there is already an event for this label at this time.
    // TODO : [x] Redefined error messages.
    // TODO : [x] Check if date is not before today.
    // TODO : [ ] Check if date is a round date. (database collision problems)

    createEvent: async (_, { input: args }, context) => {
      if (!context?.id) throw new AuthenticationError(errors.NOT_LOGGED);

      const startDate = moment(new Date(args.start));
      const now = moment(Date.now());
      if (startDate.isBefore(now)) throw new UserInputError(errors.DEFAULT);

      const user = await userShortcut.findWithRole(context.id, [database.models.subject]);
      await checkIsProfessor(user);

      const subject = await subjectShortcut.findByName(args.subject_name);
      if (!subject) throw new Error(errors.DEFAULT);

      const userOwnSubject = await user.hasSubject(subject);
      if (!userOwnSubject) throw new Error(errors.DEFAULT);

      const userOwnedEvents = await eventShortcut.findAll({ model: database.models.user, where: { id: context.id } });
      if (userOwnedEvents > 0) throw new UserInputError(errors.EVENT_TAKEN);

      const label = await labelShortcut.findByName(args.label_name, [database.models.user]);
      if (!label) throw new UserInputError(errors.DEFAULT);

      // Select every user which the label contains.
      const labelUserIds = await label.users.map((user) => user.id);

      // SQL Request select id of every user which have an event which start at the given start time.
      const sql = `SELECT User.id FROM Event JOIN Label ON Event.label_id = Label.id JOIN UserLabels ON UserLabels.label_id = Label.id JOIN User ON UserLabels.user_id = User.id WHERE Event.start = "${startDate.toISOString()}"`;
      const request = await database.query(sql, { type: QueryTypes.SELECT });

      const userIdsFromLabels = request.map((user) => user.id);

      // Intersection of the label users and the events which have and event at the given start time.
      const userIds = userIdsFromLabels.filter((id) => labelUserIds.includes(id));
      if (userIds.length > 0) throw new UserInputError(errors.USER_EVENT_TAKEN);

      const event = await database.models.event.create({
        start: startDate.toISOString(),
        link: args.link ? args.link : '',
        description: args.description,
        obligatory: args.obligatory,
      });

      await event.setLabel(label);

      await event.setSubject(subject);
      await event.setUser(user);

      return eventObject(event);
    },

    deleteEvent: async (_, args, context) => {
      if (!context?.id) throw new AuthenticationError(errors.NOT_LOGGED);

      const loggedUser = await userShortcut.findWithRole(context.id);
      await checkIsProfessor(loggedUser);

      const event = await eventShortcut.find(args.id, [database.models.user]);
      if (!event) throw new UserInputError(errors.DEFAULT);

      const userIsOwner = event.user.id === loggedUser.id;
      if (!userIsOwner) throw new ForbiddenError(errors.NOT_EVENT_OWNER);

      await event.update({ deleted_at: new Date() });
      return true;
    },

    destroyEvent: async (_, args, context) => {
      if (!context?.id) throw new AuthenticationError(errors.NOT_LOGGED);

      const loggedUser = await userShortcut.findWithRole(context.id);
      await checkIsAdmin(loggedUser);

      const event = await eventShortcut.findDeleted(args.id, [database.models.user]);
      if (!event) throw new UserInputError(errors.DEFAULT);

      await event.destroy();
      return true;
    },
  },
};
