"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolver = exports.typeDefs = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _apolloServerExpress = require("apollo-server-express");

var _shortcut = require("../utils/shortcut");

var _relationMapper = require("../utils/relationMapper");

var _authorization = require("../utils/authorization");

var _errors = _interopRequireDefault(require("../config/errors"));

var _templateObject;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var typeDefs = (0, _apolloServerExpress.gql)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  extend type Query {\n    user(id: ID!): User!\n    users: [User!]\n    allUsers: [User!]\n  }\n\n  extend type Mutation {\n    createUser(input: UserInput!): User\n\n    deleteUser(id: ID!): Boolean\n    destroyUser(id: ID!): Boolean\n\n    addLabel(user_id: String!, label_id: String!): Boolean\n    removeLabel(user_id: String!, label_id: String!): Boolean\n    clearLabels(user_id: String!): Boolean\n\n    addSubject(user_id: ID!, subject_id: ID!): Boolean\n    removeSubject(user_id: ID!, subject_id: ID!): Boolean\n    clearSubjects(user_id: ID!): Boolean\n\n    setRole(user_id: ID!, role_id: ID!): Boolean\n  }\n\n  input UserInput {\n    username: String!\n    full_name: String!\n    password: String!\n    labels_name: [String!]\n    subjects_name: [String!]\n    role_name: String!\n  }\n\n  type User {\n    id: ID!\n    username: String!\n    full_name: String!\n    password: String!\n    labels: [Label!]\n    subjects: [Subject!]\n    role: Role!\n    created_at: String!\n    updated_at: String\n    deleted_at: String\n  }\n"])));
exports.typeDefs = typeDefs;
var resolver = {
  Query: {
    user: function () {
      var _user = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_parent, args) {
        var user;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _shortcut.user.find(args.id);

              case 2:
                user = _context.sent;
                return _context.abrupt("return", user ? (0, _relationMapper.userObject)(user) : null);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function user(_x, _x2) {
        return _user.apply(this, arguments);
      }

      return user;
    }(),
    users: function () {
      var _users = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var users;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _shortcut.user.findAll();

              case 2:
                users = _context2.sent;
                return _context2.abrupt("return", users.map(_relationMapper.userObject));

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function users() {
        return _users.apply(this, arguments);
      }

      return users;
    }(),
    allUsers: function () {
      var _allUsers = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var users;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return _shortcut.user.findAllDeleted();

              case 2:
                users = _context3.sent;
                return _context3.abrupt("return", users.map(_relationMapper.userObject));

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function allUsers() {
        return _allUsers.apply(this, arguments);
      }

      return allUsers;
    }()
  },
  Mutation: {
    /* +---------------------------------------------+ User */
    createUser: function () {
      var _createUser = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(_parent, _ref, context) {
        var args, loggedUser, userExist, password, user, labels, subjects, role;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                args = _ref.input;

                if (context !== null && context !== void 0 && context.id) {
                  _context4.next = 3;
                  break;
                }

                throw new _apolloServerExpress.ForbiddenError(_errors["default"].NOT_LOGGED);

              case 3:
                _context4.next = 5;
                return _shortcut.user.findWithRole(context.id);

              case 5:
                loggedUser = _context4.sent;
                _context4.next = 8;
                return (0, _authorization.checkIsAdmin)(loggedUser);

              case 8:
                _context4.next = 10;
                return _shortcut.user.findByUsername(args.username);

              case 10:
                userExist = _context4.sent;

                if (!userExist) {
                  _context4.next = 13;
                  break;
                }

                throw new _apolloServerExpress.UserInputError(_errors["default"].USER_DUPLICATION);

              case 13:
                _context4.next = 15;
                return _bcrypt["default"].hash(args.password, 12);

              case 15:
                password = _context4.sent;
                _context4.next = 18;
                return _shortcut.user.create({
                  username: args.username,
                  full_name: args.full_name,
                  password: password
                });

              case 18:
                user = _context4.sent;

                if (!args.labels_name) {
                  _context4.next = 25;
                  break;
                }

                _context4.next = 22;
                return _shortcut.label.findAllWithCondition({
                  label_name: args.labels_name
                });

              case 22:
                labels = _context4.sent;
                _context4.next = 25;
                return user.setLabels(labels);

              case 25:
                if (!args.subjects_name) {
                  _context4.next = 31;
                  break;
                }

                _context4.next = 28;
                return _shortcut.subject.findAllWithCondition({
                  subject_name: args.subjects_name
                });

              case 28:
                subjects = _context4.sent;
                _context4.next = 31;
                return user.setSubjects(subjects);

              case 31:
                _context4.next = 33;
                return _shortcut.role.findBy({
                  role_name: args.role_name
                });

              case 33:
                role = _context4.sent;

                if (role) {
                  _context4.next = 36;
                  break;
                }

                throw new _apolloServerExpress.UserInputError(_errors["default"].DEFAULT);

              case 36:
                _context4.next = 38;
                return user.setRole(role);

              case 38:
                return _context4.abrupt("return", (0, _relationMapper.userObject)(user));

              case 39:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function createUser(_x3, _x4, _x5) {
        return _createUser.apply(this, arguments);
      }

      return createUser;
    }(),
    deleteUser: function () {
      var _deleteUser = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(_parent, args, context) {
        var loggedUser, user;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (context !== null && context !== void 0 && context.id) {
                  _context5.next = 2;
                  break;
                }

                throw new _apolloServerExpress.ForbiddenError(_errors["default"].NOT_LOGGED);

              case 2:
                _context5.next = 4;
                return _shortcut.user.findWithRole(context.id);

              case 4:
                loggedUser = _context5.sent;
                _context5.next = 7;
                return (0, _authorization.checkIsAdmin)(loggedUser);

              case 7:
                _context5.next = 9;
                return _shortcut.user.find(args.id);

              case 9:
                user = _context5.sent;

                if (user) {
                  _context5.next = 12;
                  break;
                }

                throw new _apolloServerExpress.UserInputError(_errors["default"].DEFAULT);

              case 12:
                _context5.next = 14;
                return user.update({
                  deleted_at: Date.now()
                });

              case 14:
                return _context5.abrupt("return", true);

              case 15:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function deleteUser(_x6, _x7, _x8) {
        return _deleteUser.apply(this, arguments);
      }

      return deleteUser;
    }(),
    destroyUser: function () {
      var _destroyUser = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(_parent, args, context) {
        var loggedUser, user;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (context !== null && context !== void 0 && context.id) {
                  _context6.next = 2;
                  break;
                }

                throw new _apolloServerExpress.ForbiddenError(_errors["default"].NOT_LOGGED);

              case 2:
                _context6.next = 4;
                return _shortcut.user.findWithRole(context.id);

              case 4:
                loggedUser = _context6.sent;
                _context6.next = 7;
                return (0, _authorization.checkIsAdmin)(loggedUser);

              case 7:
                _context6.next = 9;
                return _shortcut.user.findDeleted(args.id);

              case 9:
                user = _context6.sent;

                if (user) {
                  _context6.next = 12;
                  break;
                }

                throw new _apolloServerExpress.UserInputError(_errors["default"].DEFAULT);

              case 12:
                _context6.next = 14;
                return user.destroy();

              case 14:
                return _context6.abrupt("return", true);

              case 15:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function destroyUser(_x9, _x10, _x11) {
        return _destroyUser.apply(this, arguments);
      }

      return destroyUser;
    }(),

    /* +---------------------------------------------+ Label */
    addLabel: function () {
      var _addLabel = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(_parent, args, context) {
        var loggedUser, user, label;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (context !== null && context !== void 0 && context.id) {
                  _context7.next = 2;
                  break;
                }

                throw new _apolloServerExpress.ForbiddenError(_errors["default"].NOT_LOGGED);

              case 2:
                _context7.next = 4;
                return _shortcut.user.findWithRole(context.id);

              case 4:
                loggedUser = _context7.sent;
                _context7.next = 7;
                return (0, _authorization.checkIsAdmin)(loggedUser);

              case 7:
                _context7.next = 9;
                return _shortcut.user.find(args.user_id);

              case 9:
                user = _context7.sent;

                if (user) {
                  _context7.next = 12;
                  break;
                }

                throw new _apolloServerExpress.UserInputError(_errors["default"].DEFAULT);

              case 12:
                _context7.next = 14;
                return _shortcut.label.find(args.label_id);

              case 14:
                label = _context7.sent;

                if (label) {
                  _context7.next = 17;
                  break;
                }

                throw new _apolloServerExpress.UserInputError(_errors["default"].DEFAULT);

              case 17:
                _context7.next = 19;
                return user.addLabel(label);

              case 19:
                return _context7.abrupt("return", true);

              case 20:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function addLabel(_x12, _x13, _x14) {
        return _addLabel.apply(this, arguments);
      }

      return addLabel;
    }(),
    removeLabel: function () {
      var _removeLabel = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(_parent, args, context) {
        var loggedUser, user, label;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (context !== null && context !== void 0 && context.id) {
                  _context8.next = 2;
                  break;
                }

                throw new _apolloServerExpress.ForbiddenError(_errors["default"].NOT_LOGGED);

              case 2:
                _context8.next = 4;
                return _shortcut.user.findWithRole(context.id);

              case 4:
                loggedUser = _context8.sent;
                _context8.next = 7;
                return (0, _authorization.checkIsAdmin)(loggedUser);

              case 7:
                _context8.next = 9;
                return _shortcut.user.find(args.user_id);

              case 9:
                user = _context8.sent;

                if (user) {
                  _context8.next = 12;
                  break;
                }

                throw new _apolloServerExpress.UserInputError(_errors["default"].DEFAULT);

              case 12:
                _context8.next = 14;
                return _shortcut.label.find(args.label_id);

              case 14:
                label = _context8.sent;

                if (label) {
                  _context8.next = 17;
                  break;
                }

                throw new _apolloServerExpress.UserInputError(_errors["default"].DEFAULT);

              case 17:
                _context8.next = 19;
                return user.removeLabel(label);

              case 19:
                return _context8.abrupt("return", true);

              case 20:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function removeLabel(_x15, _x16, _x17) {
        return _removeLabel.apply(this, arguments);
      }

      return removeLabel;
    }(),
    clearLabels: function () {
      var _clearLabels = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(_parent, args, context) {
        var loggedUser, user;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (context !== null && context !== void 0 && context.id) {
                  _context9.next = 2;
                  break;
                }

                throw new _apolloServerExpress.ForbiddenError(_errors["default"].NOT_LOGGED);

              case 2:
                _context9.next = 4;
                return _shortcut.user.findWithRole(context.id);

              case 4:
                loggedUser = _context9.sent;
                _context9.next = 7;
                return (0, _authorization.checkIsAdmin)(loggedUser);

              case 7:
                _context9.next = 9;
                return _shortcut.user.find(args.user_id);

              case 9:
                user = _context9.sent;

                if (user) {
                  _context9.next = 12;
                  break;
                }

                throw new _apolloServerExpress.UserInputError(_errors["default"].DEFAULT);

              case 12:
                _context9.next = 14;
                return user.removeLabels();

              case 14:
                return _context9.abrupt("return", true);

              case 15:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function clearLabels(_x18, _x19, _x20) {
        return _clearLabels.apply(this, arguments);
      }

      return clearLabels;
    }(),

    /* +---------------------------------------------+ Subject */
    addSubject: function () {
      var _addSubject = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(_parent, args, context) {
        var loggedUser, user, subject;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                if (context !== null && context !== void 0 && context.id) {
                  _context10.next = 2;
                  break;
                }

                throw new _apolloServerExpress.ForbiddenError(_errors["default"].NOT_LOGGED);

              case 2:
                _context10.next = 4;
                return _shortcut.user.findWithRole(context.id);

              case 4:
                loggedUser = _context10.sent;
                _context10.next = 7;
                return (0, _authorization.checkIsAdmin)(loggedUser);

              case 7:
                _context10.next = 9;
                return _shortcut.user.find(args.user_id);

              case 9:
                user = _context10.sent;

                if (user) {
                  _context10.next = 12;
                  break;
                }

                throw new _apolloServerExpress.UserInputError(_errors["default"].DEFAULT);

              case 12:
                _context10.next = 14;
                return _shortcut.subject.find(args.subject_id);

              case 14:
                subject = _context10.sent;

                if (subject) {
                  _context10.next = 17;
                  break;
                }

                throw new _apolloServerExpress.UserInputError(_errors["default"].DEFAULT);

              case 17:
                _context10.next = 19;
                return user.addSubject(subject);

              case 19:
                return _context10.abrupt("return", true);

              case 20:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }));

      function addSubject(_x21, _x22, _x23) {
        return _addSubject.apply(this, arguments);
      }

      return addSubject;
    }(),
    removeSubject: function () {
      var _removeSubject = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(_parent, args, context) {
        var loggedUser, user, subject;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                if (context !== null && context !== void 0 && context.id) {
                  _context11.next = 2;
                  break;
                }

                throw new _apolloServerExpress.ForbiddenError(_errors["default"].NOT_LOGGED);

              case 2:
                _context11.next = 4;
                return _shortcut.user.findWithRole(context.id);

              case 4:
                loggedUser = _context11.sent;
                _context11.next = 7;
                return (0, _authorization.checkIsAdmin)(loggedUser);

              case 7:
                _context11.next = 9;
                return _shortcut.user.find(args.user_id);

              case 9:
                user = _context11.sent;

                if (user) {
                  _context11.next = 12;
                  break;
                }

                throw new _apolloServerExpress.UserInputError(_errors["default"].DEFAULT);

              case 12:
                _context11.next = 14;
                return _shortcut.subject.find(args.subject_id);

              case 14:
                subject = _context11.sent;

                if (subject) {
                  _context11.next = 17;
                  break;
                }

                throw new _apolloServerExpress.UserInputError(_errors["default"].DEFAULT);

              case 17:
                _context11.next = 19;
                return user.removeSubject(subject);

              case 19:
                return _context11.abrupt("return", true);

              case 20:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11);
      }));

      function removeSubject(_x24, _x25, _x26) {
        return _removeSubject.apply(this, arguments);
      }

      return removeSubject;
    }(),
    clearSubjects: function () {
      var _clearSubjects = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(_parent, args, context) {
        var loggedUser, user;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                if (context !== null && context !== void 0 && context.id) {
                  _context12.next = 2;
                  break;
                }

                throw new _apolloServerExpress.ForbiddenError(_errors["default"].NOT_LOGGED);

              case 2:
                _context12.next = 4;
                return _shortcut.user.findWithRole(context.id);

              case 4:
                loggedUser = _context12.sent;
                _context12.next = 7;
                return (0, _authorization.checkIsAdmin)(loggedUser);

              case 7:
                _context12.next = 9;
                return _shortcut.user.find(args.user_id);

              case 9:
                user = _context12.sent;

                if (user) {
                  _context12.next = 12;
                  break;
                }

                throw new _apolloServerExpress.UserInputError(_errors["default"].DEFAULT);

              case 12:
                _context12.next = 14;
                return user.removeSubjects();

              case 14:
                return _context12.abrupt("return", true);

              case 15:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12);
      }));

      function clearSubjects(_x27, _x28, _x29) {
        return _clearSubjects.apply(this, arguments);
      }

      return clearSubjects;
    }(),

    /* +---------------------------------------------+ Role */
    setRole: function () {
      var _setRole = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(_parent, args, context) {
        var loggedUser, user, role;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                if (context !== null && context !== void 0 && context.id) {
                  _context13.next = 2;
                  break;
                }

                throw new _apolloServerExpress.ForbiddenError(_errors["default"].NOT_LOGGED);

              case 2:
                _context13.next = 4;
                return _shortcut.user.findWithRole(context.id);

              case 4:
                loggedUser = _context13.sent;
                _context13.next = 7;
                return (0, _authorization.checkIsAdmin)(loggedUser);

              case 7:
                _context13.next = 9;
                return _shortcut.user.find(args.user_id);

              case 9:
                user = _context13.sent;

                if (user) {
                  _context13.next = 12;
                  break;
                }

                throw new _apolloServerExpress.UserInputError(_errors["default"].DEFAULT);

              case 12:
                _context13.next = 14;
                return _shortcut.role.find(args.role_id);

              case 14:
                role = _context13.sent;

                if (role) {
                  _context13.next = 17;
                  break;
                }

                throw new _apolloServerExpress.UserInputError(_errors["default"].DEFAULT);

              case 17:
                _context13.next = 19;
                return user.setRole(role);

              case 19:
                return _context13.abrupt("return", true);

              case 20:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13);
      }));

      function setRole(_x30, _x31, _x32) {
        return _setRole.apply(this, arguments);
      }

      return setRole;
    }()
  }
};
exports.resolver = resolver;
//# sourceMappingURL=user.js.map