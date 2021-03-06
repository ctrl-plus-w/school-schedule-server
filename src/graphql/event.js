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
    events(start: String!, end: String!): [Event!]

    allEvents: [Event!]

    userEvents(start: String!, end: String!): [Event!]
    ownedEvents(start: String!, end: String!): [Event!]

    labelEvents(id: ID!, start: String!, end: String!): [Event!]
    labelRelatedEvents(id: ID!, start: String!, end: String!): [Event!]
  }

  extend type Mutation {
    createEvent(input: EventInput): Event

    updateEvent(id: ID!, description: String, link: String, obligatory: Boolean): Boolean

    deleteEvent(id: ID!): Boolean
    destroyEvent(id: ID!): Boolean
  }

  input EventInput {
    start: String!
    link: String
    description: String!
    obligatory: Boolean!
    label_id: ID!
    subject_id: ID!
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

    events: async (_, args) => {
      const events = await eventShortcut.findAll(args.start, args.end);
      return events.map(eventObject);
    },

    allEvents: async () => {
      const events = await eventShortcut.findAllDeleted();
      return events.map(eventObject);
    },

    userEvents: async (_parent, args, context) => {
      if (!context?.id) throw new AuthenticationError(errors.NOT_LOGGED);

      const user = await userShortcut.find(context.id, database.models.label);
      if (!user) throw new AuthenticationError(errors.USER_NOT_FOUND);

      const userLabelIds = user.labels.map((label) => label.id);

      const events = await eventShortcut.findAllByLabelIds(userLabelIds, args.start, args.end);
      return events.map(eventObject);
    },

    ownedEvents: async (_parent, args, context) => {
      if (!context?.id) throw new AuthenticationError(errors.NOT_LOGGED);

      const user = await userShortcut.findWithRole(context.id);
      await checkIsProfessor(user);

      const userOwnedEvents = await eventShortcut.findAll(args.start, args.end, { model: database.models.user, where: { id: context.id } });
      return userOwnedEvents.map(eventObject);
    },

    labelEvents: async (_parent, args, context) => {
      if (!context?.id) throw new AuthenticationError(errors.NOT_LOGGED);

      const user = await userShortcut.findWithRole(context.id);
      await checkIsProfessor(user);

      const labelEvents = await eventShortcut.findAll(args.start, args.end, { model: database.models.label, where: { id: args.id } });
      return labelEvents.map(eventObject);
    },

    labelRelatedEvents: async (_parent, args, context) => {
      if (!context?.id) throw new AuthenticationError(errors.NOT_LOGGED);

      const user = await userShortcut.findWithRole(context.id);
      await checkIsProfessor(user);

      const label = await labelShortcut.find(args.id, [database.models.user]);
      const usersId = await label.users.map((user) => user.id);

      const usersIdStr = usersId.map((id) => `'${id}'`).join(', ');
      if (usersIdStr.length === 0) return [];

      const labelsSQL = `SELECT Label.id FROM UserLabels JOIN Label ON UserLabels.label_id = Label.id JOIN User ON UserLabels.user_id = User.id WHERE User.id IN(${usersIdStr}) AND User.deleted_at IS NULL`;
      const labels = await database.query(labelsSQL, { type: QueryTypes.SELECT });

      const labelsId = labels.map((l) => l.id);

      const events = await eventShortcut.findAll(args.start, args.end, { model: database.models.label, where: { id: labelsId } });
      return events.map(eventObject);
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
      if (startDate.isBefore(now)) throw new UserInputError(errors.EVENT_IN_PAST);

      const user = await userShortcut.findWithRole(context.id, [database.models.subject]);
      await checkIsProfessor(user);

      const subject = await subjectShortcut.find(args.subject_id);
      if (!subject) throw new Error(errors.SUBJECT_NOT_FOUND);

      const userOwnSubject = await user.hasSubject(subject);
      if (!userOwnSubject) throw new Error(errors.NOT_SUBJECT_OWNER);

      const userOwnedEvents = await eventShortcut.findAll({ model: database.models.user, where: { id: context.id } });
      if (userOwnedEvents > 0) throw new UserInputError(errors.EVENT_TAKEN);

      const label = await labelShortcut.find(args.label_id, [database.models.user]);
      if (!label) throw new UserInputError(errors.LABEL_NOT_FOUND);

      // Select every user which the label contains.
      const labelUserIds = await label.users.map((user) => user.id);

      // SQL Request select id of every user which have an event which start at the given start time.
      const sql = `SELECT User.id FROM Event JOIN Label ON Event.label_id = Label.id JOIN UserLabels ON UserLabels.label_id = Label.id JOIN User ON UserLabels.user_id = User.id WHERE Event.start = "${startDate.toISOString()}" AND Event.deleted_at IS NULL`;
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

    updateEvent: async (_, args, context) => {
      if (!context?.id) throw new AuthenticationError(errors.NOT_LOGGED);

      const loggedUser = await userShortcut.findWithRole(context.id, [database.models.subject]);
      await checkIsProfessor(loggedUser);

      const event = await eventShortcut.find(args.id, [database.models.user]);
      if (!event) throw new UserInputError(errors.EVENT_NOT_FOUND);

      const userIsOwner = event.user.id === loggedUser.id;
      if (!userIsOwner) throw new ForbiddenError(errors.NOT_EVENT_OWNER);

      await event.update({
        description: 'description' in args ? args.description : event.description,
        link: 'link' in args ? args.link : event.link,
        obligatory: 'obligatory' in args ? args.obligatory : event.obligatory,
      });
      return true;
    },

    deleteEvent: async (_, args, context) => {
      if (!context?.id) throw new AuthenticationError(errors.NOT_LOGGED);

      const loggedUser = await userShortcut.findWithRole(context.id);
      await checkIsProfessor(loggedUser);

      const event = await eventShortcut.find(args.id, [database.models.user]);
      if (!event) throw new UserInputError(errors.EVENT_NOT_FOUND);

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
      if (!event) throw new UserInputError(errors.EVENT_NOT_FOUND);

      await event.destroy();
      return true;
    },
  },
};
