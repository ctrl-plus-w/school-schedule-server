"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = exports.typeDefs = void 0;

require("core-js/modules/es.promise.js");

var _apolloServerCore = require("apollo-server-core");

var _errors = _interopRequireDefault(require("../config/errors"));

var _database = _interopRequireDefault(require("../database"));

var _shortcut = require("../utils/shortcut");

var _relationMapper = require("../utils/relationMapper");

var _authorization = require("../utils/authorization");

var _templateObject;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

const typeDefs = (0, _apolloServerCore.gql)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  extend type Query {\n    label(id: ID!): Label!\n    labels: [Label!]\n  }\n\n  extend type Mutation {\n    createLabel(input: LabelInput!): Label!\n\n    deleteLabel(id: ID!): Boolean\n\n    destroyLabel(id: ID!): Boolean\n  }\n\n  input LabelInput {\n    label_name: String!\n  }\n\n  type Label {\n    id: ID!\n    label_name: String!\n    users: [User!]\n    created_at: String!\n    updated_at: String\n    deleted_at: String\n  }\n"])));
exports.typeDefs = typeDefs;
const resolvers = {
  Query: {
    label: async (_parent, args) => {
      const label = await _shortcut.label.find(args.id);
      return (0, _relationMapper.getObjectWithUsers)(label);
    },
    labels: async () => {
      const labels = await _shortcut.label.findAll();
      return labels.map(_relationMapper.getObjectWithUsers);
    }
  },
  Mutation: {
    createLabel: async (_parent, _ref, context) => {
      let {
        input: args
      } = _ref;
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerCore.AuthenticationError(_errors.default.NOT_ALLOWED);
      const user = await _shortcut.user.findWithRole(context.id);
      await (0, _authorization.checkIsAdmin)(user);
      const labelExist = await _shortcut.label.findByName(args.label_name);
      if (labelExist) throw new _apolloServerCore.UserInputError(_errors.default.LABEL_DUPLICATION);
      const label = await _database.default.models.label.create({
        label_name: args.label_name
      });
      return (0, _relationMapper.getObjectWithUsers)(label);
    },
    deleteLabel: async (_parent, args, context) => {
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerCore.AuthenticationError(_errors.default.NOT_ALLOWED);
      const user = await _shortcut.user.findWithRole(context.id);
      await (0, _authorization.checkIsAdmin)(user);
      const label = await _shortcut.label.find(args.id, _database.default.models.user);
      if (!label) throw new _apolloServerCore.UserInputError(_errors.default.DEFAULT);
      if ((label === null || label === void 0 ? void 0 : label.users.length) > 0) throw new _apolloServerCore.UserInputError(_errors.default.LABEL_CASCADE);
      await label.update({
        deleted_at: Date.now()
      });
      return true;
    },
    destroyLabel: async (_parent, args, context) => {
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerCore.AuthenticationError(_errors.default.NOT_ALLOWED);
      const user = await _shortcut.user.findWithRole(context.id);
      await (0, _authorization.checkIsAdmin)(user);
      const label = await _shortcut.label.find(args.id, _database.default.models.user);
      if (!label) throw new _apolloServerCore.UserInputError(_errors.default.DEFAULT);
      if ((label === null || label === void 0 ? void 0 : label.users.length) > 0) throw new _apolloServerCore.UserInputError(_errors.default.LABEL_CASCADE);
      await label.destroy();
      return true;
    }
  }
};
exports.resolvers = resolvers;
//# sourceMappingURL=label.js.map