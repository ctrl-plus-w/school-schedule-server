"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = exports.typeDefs = void 0;

var _apolloServerCore = require("apollo-server-core");

var _errors = _interopRequireDefault(require("../config/errors"));

var _database = _interopRequireDefault(require("../database"));

var _relationMapper = require("../utils/relationMapper");

var _authorization = require("../utils/authorization");

var _shortcut = require("../utils/shortcut");

var _templateObject;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var typeDefs = (0, _apolloServerCore.gql)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  extend type Query {\n    subject(id: ID!): Subject!\n    subjects: [Subject!]\n  }\n\n  extend type Mutation {\n    createSubject(input: SubjectInput): Subject!\n\n    deleteSubject(id: ID!): Boolean\n\n    destroySubject(id: ID!): Boolean\n  }\n\n  input SubjectInput {\n    subject_name: String!\n    color: String!\n  }\n\n  type Subject {\n    id: ID!\n    subject_name: String!\n    color: String!\n    users: [User!]\n    created_at: String!\n    updated_at: String\n    deleted_at: String\n  }\n"])));
exports.typeDefs = typeDefs;
var resolvers = {
  Query: {
    subject: function () {
      var _subject = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_parent, args) {
        var subject;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _shortcut.subject.find(args.subject_id);

              case 2:
                subject = _context.sent;
                return _context.abrupt("return", subject ? (0, _relationMapper.getObjectWithUsers)(subject) : null);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function subject(_x, _x2) {
        return _subject.apply(this, arguments);
      }

      return subject;
    }(),
    subjects: function () {
      var _subjects = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var subjects;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _shortcut.subject.findAll();

              case 2:
                subjects = _context2.sent;
                return _context2.abrupt("return", subjects.map(_relationMapper.getObjectWithUsers));

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function subjects() {
        return _subjects.apply(this, arguments);
      }

      return subjects;
    }()
  },
  Mutation: {
    createSubject: function () {
      var _createSubject = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_parent, _ref, context) {
        var args, loggedUser, subjectExist, subject;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                args = _ref.input;

                if (context !== null && context !== void 0 && context.id) {
                  _context3.next = 3;
                  break;
                }

                throw new _apolloServerCore.ForbiddenError(_errors["default"].NOT_ALLOWED);

              case 3:
                _context3.next = 5;
                return _shortcut.user.findWithRole(context.id);

              case 5:
                loggedUser = _context3.sent;
                _context3.next = 8;
                return (0, _authorization.checkIsAdmin)(loggedUser);

              case 8:
                _context3.next = 10;
                return _shortcut.subject.findByName(args.subject_name);

              case 10:
                subjectExist = _context3.sent;

                if (!subjectExist) {
                  _context3.next = 13;
                  break;
                }

                throw new _apolloServerCore.UserInputError(_errors["default"].SUBJECT_DUPLICATION);

              case 13:
                _context3.next = 15;
                return _shortcut.subject.create({
                  subject_name: args.subject_name,
                  color: args.color
                });

              case 15:
                subject = _context3.sent;
                return _context3.abrupt("return", (0, _relationMapper.getObjectWithUsers)(subject));

              case 17:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function createSubject(_x3, _x4, _x5) {
        return _createSubject.apply(this, arguments);
      }

      return createSubject;
    }(),
    deleteSubject: function () {
      var _deleteSubject = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(_parent, args, context) {
        var loggedUser, subject;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (context !== null && context !== void 0 && context.id) {
                  _context4.next = 2;
                  break;
                }

                throw new _apolloServerCore.ForbiddenError(_errors["default"].NOT_ALLOWED);

              case 2:
                _context4.next = 4;
                return _shortcut.user.findWithRole(context.id);

              case 4:
                loggedUser = _context4.sent;
                _context4.next = 7;
                return (0, _authorization.checkIsAdmin)(loggedUser);

              case 7:
                _context4.next = 9;
                return _shortcut.subject.find(args.id, _database["default"].models.user);

              case 9:
                subject = _context4.sent;

                if (subject) {
                  _context4.next = 12;
                  break;
                }

                throw new _apolloServerCore.UserInputError(_errors["default"].DEFAULT);

              case 12:
                if (!((subject === null || subject === void 0 ? void 0 : subject.users.length) > 0)) {
                  _context4.next = 14;
                  break;
                }

                throw new _apolloServerCore.UserInputError(_errors["default"].SUBJECT_CASCADE);

              case 14:
                _context4.next = 16;
                return subject.update({
                  deleted_at: Date.now()
                });

              case 16:
                return _context4.abrupt("return", true);

              case 17:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function deleteSubject(_x6, _x7, _x8) {
        return _deleteSubject.apply(this, arguments);
      }

      return deleteSubject;
    }(),
    destroySubject: function () {
      var _destroySubject = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(_parent, args, context) {
        var loggedUser, subject;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (context !== null && context !== void 0 && context.id) {
                  _context5.next = 2;
                  break;
                }

                throw new _apolloServerCore.ForbiddenError(_errors["default"].NOT_ALLOWED);

              case 2:
                _context5.next = 4;
                return _shortcut.user.findWithRole(context.id);

              case 4:
                loggedUser = _context5.sent;
                _context5.next = 7;
                return (0, _authorization.checkIsAdmin)(loggedUser);

              case 7:
                _context5.next = 9;
                return _shortcut.subject.findDeleted(args.id, _database["default"].models.user);

              case 9:
                subject = _context5.sent;

                if (subject) {
                  _context5.next = 12;
                  break;
                }

                throw new _apolloServerCore.UserInputError(_errors["default"].DEFAULT);

              case 12:
                if (!((subject === null || subject === void 0 ? void 0 : subject.users.length) > 0)) {
                  _context5.next = 14;
                  break;
                }

                throw new _apolloServerCore.UserInputError(_errors["default"].SUBJECT_CASCADE);

              case 14:
                _context5.next = 16;
                return subject.destroy();

              case 16:
                return _context5.abrupt("return", true);

              case 17:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function destroySubject(_x9, _x10, _x11) {
        return _destroySubject.apply(this, arguments);
      }

      return destroySubject;
    }()
  }
};
exports.resolvers = resolvers;
//# sourceMappingURL=subject.js.map