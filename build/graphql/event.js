"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = exports.typeDefs = void 0;

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var typeDefs = (0, _apolloServerExpress.gql)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  extend type Query {\n    event(id: ID!): Event\n    events: [Event!]\n\n    allEvents: [Event!]\n\n    userEvents: [Event!]\n    ownedEvents: [Event!]\n\n    labelEvents(id: ID!): [Event!]\n    labelRelatedEvents(id: ID!): [Event!]\n  }\n\n  extend type Mutation {\n    createEvent(input: EventInput): Event\n\n    updateEvent(id: ID!, description: String, link: String, obligatory: Boolean): Boolean\n\n    deleteEvent(id: ID!): Boolean\n    destroyEvent(id: ID!): Boolean\n  }\n\n  input EventInput {\n    start: String!\n    link: String\n    description: String!\n    obligatory: Boolean!\n    label_id: ID!\n    subject_id: ID!\n  }\n\n  type Event {\n    id: ID!\n    start: String!\n    link: String\n    description: String!\n    obligatory: Boolean!\n    owner: User\n    label: Label\n    subject: Subject\n    created_at: String!\n    updated_at: String\n    deleted_at: String\n  }\n"])));
exports.typeDefs = typeDefs;
var resolvers = {
  Query: {
    event: function () {
      var _event = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_, args) {
        var event;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _shortcut.event.find(args.id);

              case 2:
                event = _context.sent;
                return _context.abrupt("return", (0, _relationMapper.eventObject)(event));

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function event(_x, _x2) {
        return _event.apply(this, arguments);
      }

      return event;
    }(),
    events: function () {
      var _events = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var events;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _shortcut.event.findAll();

              case 2:
                events = _context2.sent;
                return _context2.abrupt("return", events.map(_relationMapper.eventObject));

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function events() {
        return _events.apply(this, arguments);
      }

      return events;
    }(),
    allEvents: function () {
      var _allEvents = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var events;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return _shortcut.event.findAllDeleted();

              case 2:
                events = _context3.sent;
                return _context3.abrupt("return", events.map(_relationMapper.eventObject));

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function allEvents() {
        return _allEvents.apply(this, arguments);
      }

      return allEvents;
    }(),
    userEvents: function () {
      var _userEvents = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(_parent, _args, context) {
        var user, userLabelIds, events;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (context !== null && context !== void 0 && context.id) {
                  _context4.next = 2;
                  break;
                }

                throw new _apolloServerExpress.AuthenticationError(_errors["default"].NOT_LOGGED);

              case 2:
                _context4.next = 4;
                return _shortcut.user.find(context.id, _database["default"].models.label);

              case 4:
                user = _context4.sent;

                if (user) {
                  _context4.next = 7;
                  break;
                }

                throw new _apolloServerExpress.AuthenticationError(_errors["default"].DEFAULT);

              case 7:
                userLabelIds = user.labels.map(function (label) {
                  return label.id;
                });
                _context4.next = 10;
                return _shortcut.event.findAllByLabelIds(userLabelIds);

              case 10:
                events = _context4.sent;
                return _context4.abrupt("return", events.map(_relationMapper.eventObject));

              case 12:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function userEvents(_x3, _x4, _x5) {
        return _userEvents.apply(this, arguments);
      }

      return userEvents;
    }(),
    ownedEvents: function () {
      var _ownedEvents = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(_parent, _args, context) {
        var user, userOwnedEvents;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (context !== null && context !== void 0 && context.id) {
                  _context5.next = 2;
                  break;
                }

                throw new _apolloServerExpress.AuthenticationError(_errors["default"].NOT_LOGGED);

              case 2:
                _context5.next = 4;
                return _shortcut.user.findWithRole(context.id);

              case 4:
                user = _context5.sent;
                _context5.next = 7;
                return (0, _authorization.checkIsProfessor)(user);

              case 7:
                _context5.next = 9;
                return _shortcut.event.findAll({
                  model: _database["default"].models.user,
                  where: {
                    id: context.id
                  }
                });

              case 9:
                userOwnedEvents = _context5.sent;
                return _context5.abrupt("return", userOwnedEvents.map(_relationMapper.eventObject));

              case 11:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function ownedEvents(_x6, _x7, _x8) {
        return _ownedEvents.apply(this, arguments);
      }

      return ownedEvents;
    }(),
    labelEvents: function () {
      var _labelEvents = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(_parent, args, context) {
        var user, labelEvents;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (context !== null && context !== void 0 && context.id) {
                  _context6.next = 2;
                  break;
                }

                throw new _apolloServerExpress.AuthenticationError(_errors["default"].NOT_LOGGED);

              case 2:
                _context6.next = 4;
                return _shortcut.user.findWithRole(context.id);

              case 4:
                user = _context6.sent;
                _context6.next = 7;
                return (0, _authorization.checkIsProfessor)(user);

              case 7:
                _context6.next = 9;
                return _shortcut.event.findAll({
                  model: _database["default"].models.label,
                  where: {
                    id: args.id
                  }
                });

              case 9:
                labelEvents = _context6.sent;
                return _context6.abrupt("return", labelEvents.map(_relationMapper.eventObject));

              case 11:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function labelEvents(_x9, _x10, _x11) {
        return _labelEvents.apply(this, arguments);
      }

      return labelEvents;
    }(),
    labelRelatedEvents: function () {
      var _labelRelatedEvents = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(_parent, args, context) {
        var user, label, usersId, usersIdStr, labelsSQL, labels, labelsId, events;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (context !== null && context !== void 0 && context.id) {
                  _context7.next = 2;
                  break;
                }

                throw new _apolloServerExpress.AuthenticationError(_errors["default"].NOT_LOGGED);

              case 2:
                _context7.next = 4;
                return _shortcut.user.findWithRole(context.id);

              case 4:
                user = _context7.sent;
                _context7.next = 7;
                return (0, _authorization.checkIsProfessor)(user);

              case 7:
                _context7.next = 9;
                return _shortcut.label.find(args.id, [_database["default"].models.user]);

              case 9:
                label = _context7.sent;
                _context7.next = 12;
                return label.users.map(function (user) {
                  return user.id;
                });

              case 12:
                usersId = _context7.sent;
                usersIdStr = usersId.map(function (id) {
                  return "'".concat(id, "'");
                }).join(', ');

                if (!(usersIdStr.length === 0)) {
                  _context7.next = 16;
                  break;
                }

                return _context7.abrupt("return", []);

              case 16:
                labelsSQL = "SELECT Label.id FROM UserLabels JOIN Label ON UserLabels.label_id = Label.id JOIN User ON UserLabels.user_id = User.id WHERE User.id IN(".concat(usersIdStr, ")");
                _context7.next = 19;
                return _database["default"].query(labelsSQL, {
                  type: _sequelize.QueryTypes.SELECT
                });

              case 19:
                labels = _context7.sent;
                labelsId = labels.map(function (l) {
                  return l.id;
                });
                _context7.next = 23;
                return _shortcut.event.findAll({
                  model: _database["default"].models.label,
                  where: {
                    id: labelsId
                  }
                });

              case 23:
                events = _context7.sent;
                return _context7.abrupt("return", events.map(_relationMapper.eventObject));

              case 25:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function labelRelatedEvents(_x12, _x13, _x14) {
        return _labelRelatedEvents.apply(this, arguments);
      }

      return labelRelatedEvents;
    }()
  },
  Mutation: {
    // TODO : [x] Verify permissions of user when creating the event (subject owning etc...)
    // TODO : [x] Set the user & role detection into the jwt and the request.
    // TODO : [x] Verify if there is already an event for this label at this time.
    // TODO : [x] Redefined error messages.
    // TODO : [x] Check if date is not before today.
    // TODO : [ ] Check if date is a round date. (database collision problems)
    createEvent: function () {
      var _createEvent = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(_, _ref, context) {
        var args, startDate, now, user, subject, userOwnSubject, userOwnedEvents, label, labelUserIds, sql, request, userIdsFromLabels, userIds, event;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                args = _ref.input;

                if (context !== null && context !== void 0 && context.id) {
                  _context8.next = 3;
                  break;
                }

                throw new _apolloServerExpress.AuthenticationError(_errors["default"].NOT_LOGGED);

              case 3:
                startDate = (0, _moment["default"])(new Date(args.start));
                now = (0, _moment["default"])(Date.now());

                if (!startDate.isBefore(now)) {
                  _context8.next = 7;
                  break;
                }

                throw new _apolloServerExpress.UserInputError(_errors["default"].DEFAULT);

              case 7:
                _context8.next = 9;
                return _shortcut.user.findWithRole(context.id, [_database["default"].models.subject]);

              case 9:
                user = _context8.sent;
                _context8.next = 12;
                return (0, _authorization.checkIsProfessor)(user);

              case 12:
                _context8.next = 14;
                return _shortcut.subject.find(args.subject_id);

              case 14:
                subject = _context8.sent;

                if (subject) {
                  _context8.next = 17;
                  break;
                }

                throw new Error(_errors["default"].DEFAULT);

              case 17:
                _context8.next = 19;
                return user.hasSubject(subject);

              case 19:
                userOwnSubject = _context8.sent;

                if (userOwnSubject) {
                  _context8.next = 22;
                  break;
                }

                throw new Error(_errors["default"].DEFAULT);

              case 22:
                _context8.next = 24;
                return _shortcut.event.findAll({
                  model: _database["default"].models.user,
                  where: {
                    id: context.id
                  }
                });

              case 24:
                userOwnedEvents = _context8.sent;

                if (!(userOwnedEvents > 0)) {
                  _context8.next = 27;
                  break;
                }

                throw new _apolloServerExpress.UserInputError(_errors["default"].EVENT_TAKEN);

              case 27:
                _context8.next = 29;
                return _shortcut.label.find(args.label_id, [_database["default"].models.user]);

              case 29:
                label = _context8.sent;

                if (label) {
                  _context8.next = 32;
                  break;
                }

                throw new _apolloServerExpress.UserInputError(_errors["default"].DEFAULT);

              case 32:
                _context8.next = 34;
                return label.users.map(function (user) {
                  return user.id;
                });

              case 34:
                labelUserIds = _context8.sent;
                // SQL Request select id of every user which have an event which start at the given start time.
                sql = "SELECT User.id FROM Event JOIN Label ON Event.label_id = Label.id JOIN UserLabels ON UserLabels.label_id = Label.id JOIN User ON UserLabels.user_id = User.id WHERE Event.start = \"".concat(startDate.toISOString(), "\"");
                _context8.next = 38;
                return _database["default"].query(sql, {
                  type: _sequelize.QueryTypes.SELECT
                });

              case 38:
                request = _context8.sent;
                userIdsFromLabels = request.map(function (user) {
                  return user.id;
                }); // Intersection of the label users and the events which have and event at the given start time.

                userIds = userIdsFromLabels.filter(function (id) {
                  return labelUserIds.includes(id);
                });

                if (!(userIds.length > 0)) {
                  _context8.next = 43;
                  break;
                }

                throw new _apolloServerExpress.UserInputError(_errors["default"].USER_EVENT_TAKEN);

              case 43:
                _context8.next = 45;
                return _database["default"].models.event.create({
                  start: startDate.toISOString(),
                  link: args.link ? args.link : '',
                  description: args.description,
                  obligatory: args.obligatory
                });

              case 45:
                event = _context8.sent;
                _context8.next = 48;
                return event.setLabel(label);

              case 48:
                _context8.next = 50;
                return event.setSubject(subject);

              case 50:
                _context8.next = 52;
                return event.setUser(user);

              case 52:
                return _context8.abrupt("return", (0, _relationMapper.eventObject)(event));

              case 53:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function createEvent(_x15, _x16, _x17) {
        return _createEvent.apply(this, arguments);
      }

      return createEvent;
    }(),
    updateEvent: function () {
      var _updateEvent = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(_, args, context) {
        var loggedUser, event, userIsOwner;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (context !== null && context !== void 0 && context.id) {
                  _context9.next = 2;
                  break;
                }

                throw new _apolloServerExpress.AuthenticationError(_errors["default"].NOT_LOGGED);

              case 2:
                _context9.next = 4;
                return _shortcut.user.findWithRole(context.id, [_database["default"].models.subject]);

              case 4:
                loggedUser = _context9.sent;
                _context9.next = 7;
                return (0, _authorization.checkIsProfessor)(loggedUser);

              case 7:
                _context9.next = 9;
                return _shortcut.event.find(args.id, [_database["default"].models.user]);

              case 9:
                event = _context9.sent;

                if (event) {
                  _context9.next = 12;
                  break;
                }

                throw new _apolloServerExpress.UserInputError(_errors["default"].DEFAULT);

              case 12:
                userIsOwner = event.user.id === loggedUser.id;

                if (userIsOwner) {
                  _context9.next = 15;
                  break;
                }

                throw new _apolloServerExpress.ForbiddenError(_errors["default"].NOT_EVENT_OWNER);

              case 15:
                _context9.next = 17;
                return event.update({
                  description: 'description' in args ? args.description : event.description,
                  link: 'link' in args ? args.link : event.link,
                  obligatory: 'obligatory' in args ? args.obligatory : event.obligatory
                });

              case 17:
                return _context9.abrupt("return", true);

              case 18:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function updateEvent(_x18, _x19, _x20) {
        return _updateEvent.apply(this, arguments);
      }

      return updateEvent;
    }(),
    deleteEvent: function () {
      var _deleteEvent = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(_, args, context) {
        var loggedUser, event, userIsOwner;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                if (context !== null && context !== void 0 && context.id) {
                  _context10.next = 2;
                  break;
                }

                throw new _apolloServerExpress.AuthenticationError(_errors["default"].NOT_LOGGED);

              case 2:
                _context10.next = 4;
                return _shortcut.user.findWithRole(context.id);

              case 4:
                loggedUser = _context10.sent;
                _context10.next = 7;
                return (0, _authorization.checkIsProfessor)(loggedUser);

              case 7:
                _context10.next = 9;
                return _shortcut.event.find(args.id, [_database["default"].models.user]);

              case 9:
                event = _context10.sent;

                if (event) {
                  _context10.next = 12;
                  break;
                }

                throw new _apolloServerExpress.UserInputError(_errors["default"].DEFAULT);

              case 12:
                userIsOwner = event.user.id === loggedUser.id;

                if (userIsOwner) {
                  _context10.next = 15;
                  break;
                }

                throw new _apolloServerExpress.ForbiddenError(_errors["default"].NOT_EVENT_OWNER);

              case 15:
                _context10.next = 17;
                return event.update({
                  deleted_at: new Date()
                });

              case 17:
                return _context10.abrupt("return", true);

              case 18:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }));

      function deleteEvent(_x21, _x22, _x23) {
        return _deleteEvent.apply(this, arguments);
      }

      return deleteEvent;
    }(),
    destroyEvent: function () {
      var _destroyEvent = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(_, args, context) {
        var loggedUser, event;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                if (context !== null && context !== void 0 && context.id) {
                  _context11.next = 2;
                  break;
                }

                throw new _apolloServerExpress.AuthenticationError(_errors["default"].NOT_LOGGED);

              case 2:
                _context11.next = 4;
                return _shortcut.user.findWithRole(context.id);

              case 4:
                loggedUser = _context11.sent;
                _context11.next = 7;
                return (0, _authorization.checkIsAdmin)(loggedUser);

              case 7:
                _context11.next = 9;
                return _shortcut.event.findDeleted(args.id, [_database["default"].models.user]);

              case 9:
                event = _context11.sent;

                if (event) {
                  _context11.next = 12;
                  break;
                }

                throw new _apolloServerExpress.UserInputError(_errors["default"].DEFAULT);

              case 12:
                _context11.next = 14;
                return event.destroy();

              case 14:
                return _context11.abrupt("return", true);

              case 15:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11);
      }));

      function destroyEvent(_x24, _x25, _x26) {
        return _destroyEvent.apply(this, arguments);
      }

      return destroyEvent;
    }()
  }
};
exports.resolvers = resolvers;
//# sourceMappingURL=event.js.map