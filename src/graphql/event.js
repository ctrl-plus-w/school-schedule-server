/* eslint-disable no-unused-vars */
import { QueryTypes } from 'sequelize';
import { AuthenticationError, gql } from 'apollo-server-express';

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
    createEvent(input: EventInputById): Event

    deleteEvent(id: ID!): Boolean
    destroyEvent(id: ID!): Boolean
  }

  input EventInputById {
    start: String!
    link: String
    description: String!
    obligatory: Boolean!
    label_id: String!
    subject_id: String!
  }

  input EventInputByName {
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
    // TODO : [ ] Set the user & role detection into the jwt and the request.
    // TODO : [x] Verify if there is already an event for this label at this time.
    // TODO : [x] Redefined error messages.
    // TODO : [x] Check if date is not before today.
    // TODO : [ ] Check if date is a round date. (database collision problems)

    createEvent: async (_, { input: args }, context) => {
      if (!context?.id) throw new Error(errors.NOT_LOGGED);

      const startDate = moment(new Date(args.start));
      if (startDate.isBefore(moment(Date.now()))) throw new Error(errors.DEFAULT);

      const user = await database.models.user.findByPk(context.id, {
        where: { deleted_at: null },
        include: [database.models.role, database.models.subject],
      });

      if (!user) throw new Error("User does't exist.");
      if (user.role.role_name !== config.ROLES.PROFESSOR) throw new Error(errors.NOT_ALLOWED);
      if (!user.subjects) throw new Error(errors.DEFAULT);

      const userOwnedEvents = await database.models.event.count({
        where: { deleted_at: null, start: startDate.toISOString() },
        include: [{ model: database.models.user, where: { id: context.id } }],
      });

      if (userOwnedEvents > 0) throw new Error(errors.EVENT_TAKEN);

      const label = await database.models.label.findByPk(args.label_id, { where: { deleted_at: null }, include: database.models.user });
      if (!label) throw new Error(errors.DEFAULT);

      const sql = `SELECT User.id FROM Event JOIN Label ON Event.label_id = Label.id JOIN UserLabels ON UserLabels.label_id = Label.id JOIN User ON UserLabels.user_id = User.id WHERE Event.start = "${startDate.toISOString()}"`;
      const request = await database.query(sql, { type: QueryTypes.SELECT });

      const labelUserIds = await label.toJSON().users.map((obj) => obj.id);
      const userIdsFromLabels = request.map((obj) => obj.id);

      const userIds = userIdsFromLabels.filter((id) => labelUserIds.includes(id));
      if (userIds.length > 0) throw new Error(errors.USER_EVENT_TAKEN);

      const subject = await database.models.subject.findByPk(args.subject_id, { where: { deleted_at: null } });
      if (!subject) throw new Error(errors.DEFAULT);

      const userOwnSubject = await user.hasSubject(subject);
      if (!userOwnSubject) throw new Error(errors.DEFAULT);

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

    // TODO : For delete and destroy, do it if the permission is admin / professor.

    deleteEvent: async (_, args, context) => {
      if (!context?.id) throw new Error(errors.NOT_LOGGED);

      const user = await database.models.user.findByPk(context.id, { where: { deleted_at: null }, include: database.models.role });

      if (!user) throw new Error(errors.DEFAULT);
      if (user.role.role_name !== config.ROLES.PROFESSOR) throw new Error(errors.NOT_ALLOWED);

      const event = await database.models.event.findByPk(args.event_id, { where: { deleted_at: null }, include: database.models.user });
      if (!event) throw new Error(errors.DEFAULT);

      const userIsOwner = event.user.id === user.id;
      if (!userIsOwner) throw new Error(errors.NOT_EVENT_OWNER);

      await event.update({ deleted_at: new Date() });

      return true;
    },

    destroyEvent: async (_, args, context) => {
      if (!context?.id) throw new Error(errors.NOT_LOGGED);

      const user = await database.models.user.findByPk(context.id, { where: { deleted_at: null }, include: [{ model: database.models.role }] });

      if (!user) throw new Error(errors.DEFAULT);
      if (user.role.role_name !== config.ROLES.ADMIN) throw new Error(errors.NOT_ALLOWED);

      const event = await database.models.event.findByPk(args.event_id, { include: database.models.user });
      if (!event) throw new Error(errors.DEFAULT);

      await event.destroy();

      return true;
    },
  },
};
