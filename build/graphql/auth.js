"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = exports.typeDefs = void 0;

require("core-js/modules/es.promise.js");

var _apolloServerCore = require("apollo-server-core");

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _shortcut = require("../utils/shortcut");

var _config = _interopRequireDefault(require("../config"));

var _errors = _interopRequireDefault(require("../config/errors"));

var _database = _interopRequireDefault(require("../database"));

var _templateObject;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

const typeDefs = (0, _apolloServerCore.gql)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  extend type Mutation {\n    login(username: String!, password: String!): AuthData!\n\n    verifyToken: AuthData!\n  }\n\n  type AuthData {\n    id: ID!\n    role: String!\n    full_name: String!\n    token: String!\n  }\n"])));
exports.typeDefs = typeDefs;
const resolvers = {
  Mutation: {
    login: async (_parent, args) => {
      const user = await _shortcut.user.findByUsername(args.username, [_database.default.models.role]);
      if (!user) throw new _apolloServerCore.AuthenticationError(_errors.default.BAD_CREDENTIAL);
      const isPasswordValid = await _bcrypt.default.compare(args.password, user.password);
      if (!isPasswordValid) throw new _apolloServerCore.AuthenticationError(_errors.default.BAD_CREDENTIAL);
      const payload = {
        id: user.id,
        role: user.role.role_name,
        full_name: user.full_name
      };
      const options = {
        expiresIn: "".concat(_config.default.JWT_TOKEN_EXPIRATION, "h")
      };

      const token = _jsonwebtoken.default.sign(payload, _config.default.JWT_KEY, options);

      return _objectSpread(_objectSpread({}, payload), {}, {
        token
      });
    },
    verifyToken: async (_parent, _args, context) => {
      if (!context.auth) throw new Error(_errors.default.NOT_ALLOWED);
      return {
        id: context.id,
        role: context.role,
        full_name: context.full_name,
        token: context.token
      };
    }
  }
};
exports.resolvers = resolvers;
//# sourceMappingURL=auth.js.map