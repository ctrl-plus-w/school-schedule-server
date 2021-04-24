"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = exports.typeDefs = void 0;

require("core-js/modules/es.promise.js");

require("core-js/modules/es.string.includes.js");

require("core-js/modules/es.symbol.description.js");

var _sequelize = require("sequelize");

var _apolloServerExpress = require("apollo-server-express");

var _moment = _interopRequireDefault(require("moment"));

var _relationMapper = require("../utils/relationMapper");

var _shortcut = require("../utils/shortcut");

var _authorization = require("../utils/authorization");

var _config = _interopRequireDefault(require("../config"));

var _errors = _interopRequireDefault(require("../config/errors"));

var _database = _interopRequireDefault(require("../database"));

var _templateObject;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

const typeDefs = (0, _apolloServerExpress.gql)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  extend type Query {\n    event(id: ID!): Event\n    events: [Event!]\n\n    allEvents: [Event!]\n\n    userEvents: [Event!]\n    ownedEvents: [Event!]\n\n    labelEvents(id: ID!): [Event!]\n    labelRelatedEvents(id: ID!): [Event!]\n  }\n\n  extend type Mutation {\n    createEvent(input: EventInput): Event\n\n    updateEvent(id: ID!, description: String, link: String, obligatory: Boolean): Boolean\n\n    deleteEvent(id: ID!): Boolean\n    destroyEvent(id: ID!): Boolean\n  }\n\n  input EventInput {\n    start: String!\n    link: String\n    description: String!\n    obligatory: Boolean!\n    label_id: ID!\n    subject_id: ID!\n  }\n\n  type Event {\n    id: ID!\n    start: String!\n    link: String\n    description: String!\n    obligatory: Boolean!\n    owner: User\n    label: Label\n    subject: Subject\n    created_at: String!\n    updated_at: String\n    deleted_at: String\n  }\n"])));
exports.typeDefs = typeDefs;
const resolvers = {
  Query: {
    event: async (_, args) => {
      const event = await _shortcut.event.find(args.id);
      return (0, _relationMapper.eventObject)(event);
    },
    events: async () => {
      const events = await _shortcut.event.findAll();
      return events.map(_relationMapper.eventObject);
    },
    allEvents: async () => {
      const events = await _shortcut.event.findAllDeleted();
      return events.map(_relationMapper.eventObject);
    },
    userEvents: async (_parent, _args, context) => {
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerExpress.AuthenticationError(_errors.default.NOT_LOGGED);
      const user = await _shortcut.user.find(context.id, _database.default.models.label);
      if (!user) throw new _apolloServerExpress.AuthenticationError(_errors.default.DEFAULT);
      const userLabelIds = user.labels.map(label => label.id);
      const events = await _shortcut.event.findAllByLabelIds(userLabelIds);
      return events.map(_relationMapper.eventObject);
    },
    ownedEvents: async (_parent, _args, context) => {
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerExpress.AuthenticationError(_errors.default.NOT_LOGGED);
      const user = await _shortcut.user.findWithRole(context.id);
      await (0, _authorization.checkIsProfessor)(user);
      const userOwnedEvents = await _shortcut.event.findAll({
        model: _database.default.models.user,
        where: {
          id: context.id
        }
      });
      return userOwnedEvents.map(_relationMapper.eventObject);
    },
    labelEvents: async (_parent, args, context) => {
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerExpress.AuthenticationError(_errors.default.NOT_LOGGED);
      const user = await _shortcut.user.findWithRole(context.id);
      await (0, _authorization.checkIsProfessor)(user);
      const labelEvents = await _shortcut.event.findAll({
        model: _database.default.models.label,
        where: {
          id: args.id
        }
      });
      return labelEvents.map(_relationMapper.eventObject);
    },
    labelRelatedEvents: async (_parent, args, context) => {
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerExpress.AuthenticationError(_errors.default.NOT_LOGGED);
      const user = await _shortcut.user.findWithRole(context.id);
      await (0, _authorization.checkIsProfessor)(user);
      const label = await _shortcut.label.find(args.id, [_database.default.models.user]);
      const usersId = await label.users.map(user => user.id);
      const usersIdStr = usersId.map(id => "'".concat(id, "'")).join(', ');
      if (usersIdStr.length === 0) return [];
      const labelsSQL = "SELECT Label.id FROM UserLabels JOIN Label ON UserLabels.label_id = Label.id JOIN User ON UserLabels.user_id = User.id WHERE User.id IN(".concat(usersIdStr, ")");
      const labels = await _database.default.query(labelsSQL, {
        type: _sequelize.QueryTypes.SELECT
      });
      const labelsId = labels.map(l => l.id);
      const events = await _shortcut.event.findAll({
        model: _database.default.models.label,
        where: {
          id: labelsId
        }
      });
      return events.map(_relationMapper.eventObject);
    }
  },
  Mutation: {
    // TODO : [x] Verify permissions of user when creating the event (subject owning etc...)
    // TODO : [x] Set the user & role detection into the jwt and the request.
    // TODO : [x] Verify if there is already an event for this label at this time.
    // TODO : [x] Redefined error messages.
    // TODO : [x] Check if date is not before today.
    // TODO : [ ] Check if date is a round date. (database collision problems)
    createEvent: async (_, _ref, context) => {
      let {
        input: args
      } = _ref;
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerExpress.AuthenticationError(_errors.default.NOT_LOGGED);
      const startDate = (0, _moment.default)(new Date(args.start));
      const now = (0, _moment.default)(Date.now());
      if (startDate.isBefore(now)) throw new _apolloServerExpress.UserInputError(_errors.default.DEFAULT);
      const user = await _shortcut.user.findWithRole(context.id, [_database.default.models.subject]);
      await (0, _authorization.checkIsProfessor)(user);
      const subject = await _shortcut.subject.find(args.subject_id);
      if (!subject) throw new Error(_errors.default.DEFAULT);
      const userOwnSubject = await user.hasSubject(subject);
      if (!userOwnSubject) throw new Error(_errors.default.DEFAULT);
      const userOwnedEvents = await _shortcut.event.findAll({
        model: _database.default.models.user,
        where: {
          id: context.id
        }
      });
      if (userOwnedEvents > 0) throw new _apolloServerExpress.UserInputError(_errors.default.EVENT_TAKEN);
      const label = await _shortcut.label.find(args.label_id, [_database.default.models.user]);
      if (!label) throw new _apolloServerExpress.UserInputError(_errors.default.DEFAULT); // Select every user which the label contains.

      const labelUserIds = await label.users.map(user => user.id); // SQL Request select id of every user which have an event which start at the given start time.

      const sql = "SELECT User.id FROM Event JOIN Label ON Event.label_id = Label.id JOIN UserLabels ON UserLabels.label_id = Label.id JOIN User ON UserLabels.user_id = User.id WHERE Event.start = \"".concat(startDate.toISOString(), "\"");
      const request = await _database.default.query(sql, {
        type: _sequelize.QueryTypes.SELECT
      });
      const userIdsFromLabels = request.map(user => user.id); // Intersection of the label users and the events which have and event at the given start time.

      const userIds = userIdsFromLabels.filter(id => labelUserIds.includes(id));
      if (userIds.length > 0) throw new _apolloServerExpress.UserInputError(_errors.default.USER_EVENT_TAKEN);
      const event = await _database.default.models.event.create({
        start: startDate.toISOString(),
        link: args.link ? args.link : '',
        description: args.description,
        obligatory: args.obligatory
      });
      await event.setLabel(label);
      await event.setSubject(subject);
      await event.setUser(user);
      return (0, _relationMapper.eventObject)(event);
    },
    updateEvent: async (_, args, context) => {
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerExpress.AuthenticationError(_errors.default.NOT_LOGGED);
      const loggedUser = await _shortcut.user.findWithRole(context.id, [_database.default.models.subject]);
      await (0, _authorization.checkIsProfessor)(loggedUser);
      const event = await _shortcut.event.find(args.id, [_database.default.models.user]);
      if (!event) throw new _apolloServerExpress.UserInputError(_errors.default.DEFAULT);
      const userIsOwner = event.user.id === loggedUser.id;
      if (!userIsOwner) throw new _apolloServerExpress.ForbiddenError(_errors.default.NOT_EVENT_OWNER);
      await event.update({
        description: 'description' in args ? args.description : event.description,
        link: 'link' in args ? args.link : event.link,
        obligatory: 'obligatory' in args ? args.obligatory : event.obligatory
      });
      return true;
    },
    deleteEvent: async (_, args, context) => {
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerExpress.AuthenticationError(_errors.default.NOT_LOGGED);
      const loggedUser = await _shortcut.user.findWithRole(context.id);
      await (0, _authorization.checkIsProfessor)(loggedUser);
      const event = await _shortcut.event.find(args.id, [_database.default.models.user]);
      if (!event) throw new _apolloServerExpress.UserInputError(_errors.default.DEFAULT);
      const userIsOwner = event.user.id === loggedUser.id;
      if (!userIsOwner) throw new _apolloServerExpress.ForbiddenError(_errors.default.NOT_EVENT_OWNER);
      await event.update({
        deleted_at: new Date()
      });
      return true;
    },
    destroyEvent: async (_, args, context) => {
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerExpress.AuthenticationError(_errors.default.NOT_LOGGED);
      const loggedUser = await _shortcut.user.findWithRole(context.id);
      await (0, _authorization.checkIsAdmin)(loggedUser);
      const event = await _shortcut.event.findDeleted(args.id, [_database.default.models.user]);
      if (!event) throw new _apolloServerExpress.UserInputError(_errors.default.DEFAULT);
      await event.destroy();
      return true;
    }
  }
};
exports.resolvers = resolvers;
//# sourceMappingURL=event.js.map