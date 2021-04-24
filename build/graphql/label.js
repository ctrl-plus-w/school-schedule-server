"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = exports.typeDefs = void 0;

var _apolloServerCore = require("apollo-server-core");

var _errors = _interopRequireDefault(require("../config/errors"));

var _database = _interopRequireDefault(require("../database"));

var _shortcut = require("../utils/shortcut");

var _relationMapper = require("../utils/relationMapper");

var _authorization = require("../utils/authorization");

var _templateObject;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var typeDefs = (0, _apolloServerCore.gql)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  extend type Query {\n    label(id: ID!): Label!\n    labels: [Label!]\n  }\n\n  extend type Mutation {\n    createLabel(input: LabelInput!): Label!\n\n    deleteLabel(id: ID!): Boolean\n\n    destroyLabel(id: ID!): Boolean\n  }\n\n  input LabelInput {\n    label_name: String!\n  }\n\n  type Label {\n    id: ID!\n    label_name: String!\n    users: [User!]\n    created_at: String!\n    updated_at: String\n    deleted_at: String\n  }\n"])));
exports.typeDefs = typeDefs;
var resolvers = {
  Query: {
    label: function () {
      var _label = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_parent, args) {
        var label;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _shortcut.label.find(args.id);

              case 2:
                label = _context.sent;
                return _context.abrupt("return", (0, _relationMapper.getObjectWithUsers)(label));

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function label(_x, _x2) {
        return _label.apply(this, arguments);
      }

      return label;
    }(),
    labels: function () {
      var _labels = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var labels;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _shortcut.label.findAll();

              case 2:
                labels = _context2.sent;
                return _context2.abrupt("return", labels.map(_relationMapper.getObjectWithUsers));

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function labels() {
        return _labels.apply(this, arguments);
      }

      return labels;
    }()
  },
  Mutation: {
    createLabel: function () {
      var _createLabel = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_parent, _ref, context) {
        var args, user, labelExist, label;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                args = _ref.input;

                if (context !== null && context !== void 0 && context.id) {
                  _context3.next = 3;
                  break;
                }

                throw new _apolloServerCore.AuthenticationError(_errors["default"].NOT_ALLOWED);

              case 3:
                _context3.next = 5;
                return _shortcut.user.findWithRole(context.id);

              case 5:
                user = _context3.sent;
                _context3.next = 8;
                return (0, _authorization.checkIsAdmin)(user);

              case 8:
                _context3.next = 10;
                return _shortcut.label.findByName(args.label_name);

              case 10:
                labelExist = _context3.sent;

                if (!labelExist) {
                  _context3.next = 13;
                  break;
                }

                throw new _apolloServerCore.UserInputError(_errors["default"].LABEL_DUPLICATION);

              case 13:
                _context3.next = 15;
                return _database["default"].models.label.create({
                  label_name: args.label_name
                });

              case 15:
                label = _context3.sent;
                return _context3.abrupt("return", (0, _relationMapper.getObjectWithUsers)(label));

              case 17:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function createLabel(_x3, _x4, _x5) {
        return _createLabel.apply(this, arguments);
      }

      return createLabel;
    }(),
    deleteLabel: function () {
      var _deleteLabel = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(_parent, args, context) {
        var user, label;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (context !== null && context !== void 0 && context.id) {
                  _context4.next = 2;
                  break;
                }

                throw new _apolloServerCore.AuthenticationError(_errors["default"].NOT_ALLOWED);

              case 2:
                _context4.next = 4;
                return _shortcut.user.findWithRole(context.id);

              case 4:
                user = _context4.sent;
                _context4.next = 7;
                return (0, _authorization.checkIsAdmin)(user);

              case 7:
                _context4.next = 9;
                return _shortcut.label.find(args.id, _database["default"].models.user);

              case 9:
                label = _context4.sent;

                if (label) {
                  _context4.next = 12;
                  break;
                }

                throw new _apolloServerCore.UserInputError(_errors["default"].DEFAULT);

              case 12:
                if (!((label === null || label === void 0 ? void 0 : label.users.length) > 0)) {
                  _context4.next = 14;
                  break;
                }

                throw new _apolloServerCore.UserInputError(_errors["default"].LABEL_CASCADE);

              case 14:
                _context4.next = 16;
                return label.update({
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

      function deleteLabel(_x6, _x7, _x8) {
        return _deleteLabel.apply(this, arguments);
      }

      return deleteLabel;
    }(),
    destroyLabel: function () {
      var _destroyLabel = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(_parent, args, context) {
        var user, label;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (context !== null && context !== void 0 && context.id) {
                  _context5.next = 2;
                  break;
                }

                throw new _apolloServerCore.AuthenticationError(_errors["default"].NOT_ALLOWED);

              case 2:
                _context5.next = 4;
                return _shortcut.user.findWithRole(context.id);

              case 4:
                user = _context5.sent;
                _context5.next = 7;
                return (0, _authorization.checkIsAdmin)(user);

              case 7:
                _context5.next = 9;
                return _shortcut.label.find(args.id, _database["default"].models.user);

              case 9:
                label = _context5.sent;

                if (label) {
                  _context5.next = 12;
                  break;
                }

                throw new _apolloServerCore.UserInputError(_errors["default"].DEFAULT);

              case 12:
                if (!((label === null || label === void 0 ? void 0 : label.users.length) > 0)) {
                  _context5.next = 14;
                  break;
                }

                throw new _apolloServerCore.UserInputError(_errors["default"].LABEL_CASCADE);

              case 14:
                _context5.next = 16;
                return label.destroy();

              case 16:
                return _context5.abrupt("return", true);

              case 17:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function destroyLabel(_x9, _x10, _x11) {
        return _destroyLabel.apply(this, arguments);
      }

      return destroyLabel;
    }()
  }
};
exports.resolvers = resolvers;
//# sourceMappingURL=label.js.map