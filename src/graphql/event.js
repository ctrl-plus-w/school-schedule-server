import { gql } from 'apollo-server-core';
import { red } from 'chalk';

import database from '../database';
import { eventObject } from '../utils/relationMapper';

import config from '../config';
import sequelize from '../database';
import { QueryTypes, Op } from 'sequelize';

import moment from 'moment';

export const typeDefs = gql`
  extend type Query {
    event(id: ID!): Event
    events: [Event!]

    allEvents: [Event!]

    userEvents: [Event!]
  }

  extend type Mutation {
    createEventById(input: EventInputById): Event
    createEventByName(input: EventInputByName): Event

    deleteEventById(user_id: ID!, event_id: ID!): Boolean
    deleteEventByName(username: ID!, event_id: ID!): Boolean

    destroyEventById(user_id: ID!, event_id: ID!): Boolean
    destroyEventByName(username: ID!, event_id: ID!): Boolean
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
      const event = await database.models.event.findByPk(args.id, { where: { deleted_at: null } });
      return eventObject(event);
    },

    events: async () => {
      const events = await database.models.event.findAll({ where: { deleted_at: null } });
      return events.map(eventObject);
    },

    allEvents: async () => {
      const events = await database.models.event.findAll();
      return events.map(eventObject);
    },

    userEvents: async (parent, args, context) => {
      if (!context?.id) throw new Error('You must be logged in.');

      const startDate = new Date();
      const endDate = new Date().setDate(new Date().getDate() + 14);

      const user = await database.models.user.findByPk(context.id, { where: { deleted_at: null }, include: database.models.label });
      if (!user) throw new Error('Username not found.');

      const userLabelIds = user.toJSON().labels.map((label) => label.id);

      const events = await database.models.event.findAll({ where: { label_id: userLabelIds, start: { [Op.between]: [startDate, endDate] } } });
      return events.map(eventObject);
    },
  },

  Mutation: {
    // TODO : [x] Verify permissions of user when creating the event (subject owning etc...)
    // TODO : [ ] Set the user & role detection into the jwt and the request.
    // TODO : [x] Verify if there is already an event for this label at this time.
    // TODO : [ ] Redefined error messages.
    // TODO : [x] Check if date is not before today.
    // TODO : [ ] Check if date is a round date. (database collision problems)

    createEventById: async (_, { input: args }) => {
      const startDate = moment(args.start);
      if (startDate.isBefore(moment(Date.now()))) throw new Error('The event cannot be in the past.');

      const user = await database.models.user.findByPk(args.user_id, {
        where: { deleted_at: null },
        include: [database.models.role, database.models.subject],
      });

      if (!user) throw new Error("User does't exist.");
      if (!user.role) throw new Error('User must have a role.');
      if (!user.subjects) throw new Error('User must own at least one subject.');

      const label = await database.models.label.findByPk(args.label_id, { where: { deleted_at: null }, include: database.models.user });
      if (!label) throw new Error("Label does't exist.");

      const sql = `SELECT User.id FROM Event JOIN Label ON Event.label_id = Label.id JOIN UserLabels ON UserLabels.label_id = Label.id JOIN User ON UserLabels.user_id = User.id WHERE Event.start = "${startDate.toISOString()}"`;
      const request = await sequelize.query(sql, { type: QueryTypes.SELECT });

      const labelUserIds = await label.toJSON().users.map((obj) => obj.id);
      const userIdsFromLabels = request.map((obj) => obj.id);

      const userIds = userIdsFromLabels.filter((id) => labelUserIds.includes(id));
      if (userIds.length > 0) throw new Error('A user already have a event at this time.');

      const subject = await database.models.subject.findByPk(args.subject_id, { where: { deleted_at: null } });
      if (!subject) throw new Error("Subject does't exist.");

      const professorRole = await database.models.role.findOne({ where: { role_name: config.ROLES.PROFESSOR, deleted_at: null } });
      if (!professorRole) throw new Error('Professor role not defined.');

      const isUserProfessor = professorRole.toJSON().id === user.toJSON().role.id;
      if (!isUserProfessor) throw new Error('User must have the professor role.');

      const userOwnSubject = await user.hasSubject(subject);
      if (!userOwnSubject) throw new Error('User must own the subject.');

      const event = await database.models.event.create({
        start: startDate.toISOString(),
        link: args.link ? args.link : '',
        obligatory: args.obligatory,
      });

      await event.setLabel(label);
      await event.setSubject(subject);
      await event.setUser(user);

      return eventObject(event);
    },

    createEventByName: async (_, { input: args }) => {
      const startDate = moment(args.start);
      if (startDate.isBefore(moment(Date.now()))) throw new Error('The event cannot be in the past.');

      const user = await database.models.user.findOne({
        where: { username: args.username },
        include: [database.models.role, database.models.subject],
      });

      if (!user) throw new Error("User does't exist.");
      if (!user.role) throw new Error('User must have a role.');
      if (!user.subjects) throw new Error('User must own at least one subject.');

      const label = await database.models.label.findOne({ where: { label_name: args.label_name, deleted_at: null }, include: database.models.user });
      if (!label) throw new Error("Label does't exist.");

      const sql = `SELECT User.id FROM Event JOIN Label ON Event.label_id = Label.id JOIN UserLabels ON UserLabels.label_id = Label.id JOIN User ON UserLabels.user_id = User.id WHERE Event.start = "${startDate.toISOString()}"`;
      const request = await sequelize.query(sql, { type: QueryTypes.SELECT });

      const labelUserIds = await label.users.map((obj) => obj.id);
      const userIdsFromLabels = request.map((obj) => obj.id);

      const userIds = userIdsFromLabels.filter((id) => labelUserIds.includes(id));
      if (userIds.length > 0) throw new Error('A user already have a event at this time.');

      const subject = await database.models.subject.findOne({ where: { subject_name: args.subject_name, deleted_at: null } });
      if (!subject) throw new Error("Subject does't exist.");

      const professorRole = await database.models.role.findOne({ where: { role_name: config.ROLES.PROFESSOR, deleted_at: null } });
      if (!professorRole) throw new Error('Professor role not defined.');

      const isUserProfessor = professorRole.toJSON().id === user.toJSON().role.id;
      if (!isUserProfessor) throw new Error('User must have the professor role.');

      const userOwnSubject = await user.hasSubject(subject);
      if (!userOwnSubject) throw new Error('User must own the subject.');

      const event = await database.models.event.create({
        start: startDate.toISOString(),
        link: args.link ? args.link : '',
        obligatory: args.obligatory,
      });

      await event.setLabel(label);
      await event.setSubject(subject);
      await event.setUser(user);

      return eventObject(event);
    },

    // TODO : For delete and destroy, do it if the permission is admin.

    deleteEventById: async (_, args) => {
      const user = await database.models.user.findByPk(args.user_id, { where: { deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const event = await database.models.event.findByPk(args.event_id, { where: { deleted_at: null }, include: database.models.user });
      if (!event) throw new Error("Event doesn't exist.");

      const userIsOwner = event.toJSON().user.id === user.toJSON().id;
      if (!userIsOwner) throw new Error('User must be the owner of the event.');

      await event.update({ deleted_at: new Date() });

      return true;
    },

    deleteEventByName: async (_, args) => {
      const user = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const event = await database.models.event.findByPk(args.event_id, { include: database.models.user, where: { deleted_at: null } });
      if (!event) throw new Error("Event doesn't exist.");

      const userIsOwner = event.toJSON().user.id === user.toJSON().id;
      if (!userIsOwner) throw new Error('User must be the owner of the event.');

      await event.update({ deleted_at: new Date() });

      return true;
    },

    destroyEventById: async (_, args) => {
      const user = await database.models.user.findByPk(args.user_id, { where: { deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const event = await database.models.event.findByPk(args.event_id, { include: database.models.user });
      if (!event) throw new Error("Event doesn't exist.");

      const userIsOwner = event.toJSON().user.id === user.toJSON().id;
      if (!userIsOwner) throw new Error('User must be the owner of the event.');

      await event.destroy();

      return true;
    },

    destroyEventByName: async (_, args) => {
      const user = await database.models.user.findOne({ where: { username: args.username, deleted_at: null } });
      if (!user) throw new Error("User doesn't exist.");

      const event = await database.models.event.findByPk(args.event_id, { include: database.models.user });
      if (!event) throw new Error("Event doesn't exist.");

      const userIsOwner = event.toJSON().user.id === user.toJSON().id;
      if (!userIsOwner) throw new Error('User must be the owner of the event.');

      await event.destroy();

      return true;
    },
  },
};
