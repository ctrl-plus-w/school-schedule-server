"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = exports.typeDefs = void 0;

var _apolloServerCore = require("apollo-server-core");

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _shortcut = require("../utils/shortcut");

var _config = _interopRequireDefault(require("../config"));

var _errors = _interopRequireDefault(require("../config/errors"));

var _database = _interopRequireDefault(require("../database"));

var _templateObject;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var typeDefs = (0, _apolloServerCore.gql)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  extend type Mutation {\n    login(username: String!, password: String!): AuthData!\n\n    verifyToken: AuthData!\n  }\n\n  type AuthData {\n    id: ID!\n    role: String!\n    full_name: String!\n    token: String!\n  }\n"])));
exports.typeDefs = typeDefs;
var resolvers = {
  Mutation: {
    login: function () {
      var _login = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_parent, args) {
        var user, isPasswordValid, payload, options, token;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _shortcut.user.findByUsername(args.username, [_database["default"].models.role]);

              case 2:
                user = _context.sent;

                if (user) {
                  _context.next = 5;
                  break;
                }

                throw new _apolloServerCore.AuthenticationError(_errors["default"].BAD_CREDENTIAL);

              case 5:
                _context.next = 7;
                return _bcrypt["default"].compare(args.password, user.password);

              case 7:
                isPasswordValid = _context.sent;

                if (isPasswordValid) {
                  _context.next = 10;
                  break;
                }

                throw new _apolloServerCore.AuthenticationError(_errors["default"].BAD_CREDENTIAL);

              case 10:
                payload = {
                  id: user.id,
                  role: user.role.role_name,
                  full_name: user.full_name
                };
                options = {
                  expiresIn: "".concat(_config["default"].JWT_TOKEN_EXPIRATION, "h")
                };
                token = _jsonwebtoken["default"].sign(payload, _config["default"].JWT_KEY, options);
                return _context.abrupt("return", _objectSpread(_objectSpread({}, payload), {}, {
                  token: token
                }));

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function login(_x, _x2) {
        return _login.apply(this, arguments);
      }

      return login;
    }(),
    verifyToken: function () {
      var _verifyToken = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_parent, _args, context) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (context.auth) {
                  _context2.next = 2;
                  break;
                }

                throw new Error(_errors["default"].NOT_ALLOWED);

              case 2:
                return _context2.abrupt("return", {
                  id: context.id,
                  role: context.role,
                  full_name: context.full_name,
                  token: context.token
                });

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function verifyToken(_x3, _x4, _x5) {
        return _verifyToken.apply(this, arguments);
      }

      return verifyToken;
    }()
  }
};
exports.resolvers = resolvers;
//# sourceMappingURL=auth.js.map