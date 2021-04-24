"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = exports.typeDefs = void 0;

require("core-js/modules/es.promise.js");

var _apolloServerCore = require("apollo-server-core");

var _errors = _interopRequireDefault(require("../config/errors"));

var _database = _interopRequireDefault(require("../database"));

var _relationMapper = require("../utils/relationMapper");

var _authorization = require("../utils/authorization");

var _shortcut = require("../utils/shortcut");

var _templateObject;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

const typeDefs = (0, _apolloServerCore.gql)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  extend type Query {\n    role(id: ID!): Role!\n    roles: [Role!]\n  }\n\n  extend type Mutation {\n    createRole(input: RoleInput): Role!\n\n    deleteRole(id: ID!): Boolean\n\n    destroyRole(id: ID!): Boolean\n  }\n\n  input RoleInput {\n    role_name: String!\n  }\n\n  type Role {\n    id: ID!\n    role_name: String!\n    users: [User!]\n    created_at: String!\n    updated_at: String\n    deleted_at: String\n  }\n"])));
exports.typeDefs = typeDefs;
const resolvers = {
  Query: {
    role: async (_parent, args) => {
      const role = await _shortcut.role.find(args.id);
      return (0, _relationMapper.getObjectWithUsers)(role);
    },
    roles: async () => {
      const roles = await _shortcut.role.findAll();
      return roles.map(_relationMapper.getObjectWithUsers);
    }
  },
  Mutation: {
    createRole: async (_parent, _ref, context) => {
      let {
        input: args
      } = _ref;
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerCore.AuthenticationError(_errors.default.NOT_ALLOWED);
      const loggedUser = await _shortcut.user.findWithRole(context.id);
      await (0, _authorization.checkIsAdmin)(loggedUser);
      const roleExist = await _shortcut.role.findByName(args.role_name);
      if (roleExist) throw new _apolloServerCore.UserInputError(_errors.default.ROLE_DUPLICATION);
      const role = await _shortcut.role.create({
        role_name: args.role_name
      });
      return (0, _relationMapper.getObjectWithUsers)(role);
    },
    deleteRole: async (_parent, args, context) => {
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerCore.AuthenticationError(_errors.default.NOT_ALLOWED);
      const loggedUser = await _shortcut.user.findWithRole(context.id);
      await (0, _authorization.checkIsAdmin)(loggedUser);
      const role = await _shortcut.role.find(args.id, _database.default.models.user);
      if (!role) throw new _apolloServerCore.UserInputError(_errors.default.DEFAULT);
      if ((role === null || role === void 0 ? void 0 : role.users.length) > 0) throw new _apolloServerCore.UserInputError(_errors.default.ROLE_CASCADE);
      await role.update({
        deleted_at: null
      });
      return true;
    },
    destroyRole: async (_parent, args, context) => {
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerCore.AuthenticationError(_errors.default.NOT_ALLOWED);
      const loggedUser = await _shortcut.user.findWithRole(context.id);
      await (0, _authorization.checkIsAdmin)(loggedUser);
      const role = await _shortcut.role.findDeleted(args.id, _database.default.models.user);
      if (!role) throw new _apolloServerCore.UserInputError(_errors.default.DEFAULT);
      if ((role === null || role === void 0 ? void 0 : role.users.length) > 0) throw new _apolloServerCore.UserInputError(_errors.default.ROLE_CASCADE);
      await role.destroy();
      return true;
    }
  }
};
exports.resolvers = resolvers;
//# sourceMappingURL=role.js.map