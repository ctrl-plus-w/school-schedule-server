"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolver = exports.typeDefs = void 0;

require("core-js/modules/es.promise.js");

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _apolloServerExpress = require("apollo-server-express");

var _shortcut = require("../utils/shortcut");

var _relationMapper = require("../utils/relationMapper");

var _authorization = require("../utils/authorization");

var _errors = _interopRequireDefault(require("../config/errors"));

var _templateObject;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

const typeDefs = (0, _apolloServerExpress.gql)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  extend type Query {\n    user(id: ID!): User!\n    users: [User!]\n    allUsers: [User!]\n  }\n\n  extend type Mutation {\n    createUser(input: UserInput!): User\n\n    deleteUser(id: ID!): Boolean\n    destroyUser(id: ID!): Boolean\n\n    addLabel(user_id: String!, label_id: String!): Boolean\n    removeLabel(user_id: String!, label_id: String!): Boolean\n    clearLabels(user_id: String!): Boolean\n\n    addSubject(user_id: ID!, subject_id: ID!): Boolean\n    removeSubject(user_id: ID!, subject_id: ID!): Boolean\n    clearSubjects(user_id: ID!): Boolean\n\n    setRole(user_id: ID!, role_id: ID!): Boolean\n  }\n\n  input UserInput {\n    username: String!\n    full_name: String!\n    password: String!\n    labels_name: [String!]\n    subjects_name: [String!]\n    role_name: String!\n  }\n\n  type User {\n    id: ID!\n    username: String!\n    full_name: String!\n    password: String!\n    labels: [Label!]\n    subjects: [Subject!]\n    role: Role!\n    created_at: String!\n    updated_at: String\n    deleted_at: String\n  }\n"])));
exports.typeDefs = typeDefs;
const resolver = {
  Query: {
    user: async (_parent, args) => {
      const user = await _shortcut.user.find(args.id);
      return user ? (0, _relationMapper.userObject)(user) : null;
    },
    users: async () => {
      const users = await _shortcut.user.findAll();
      return users.map(_relationMapper.userObject);
    },
    allUsers: async () => {
      const users = await _shortcut.user.findAllDeleted();
      return users.map(_relationMapper.userObject);
    }
  },
  Mutation: {
    /* +---------------------------------------------+ User */
    createUser: async (_parent, _ref, context) => {
      let {
        input: args
      } = _ref;
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerExpress.ForbiddenError(_errors.default.NOT_LOGGED);
      const loggedUser = await _shortcut.user.findWithRole(context.id);
      await (0, _authorization.checkIsAdmin)(loggedUser);
      const userExist = await _shortcut.user.findByUsername(args.username);
      if (userExist) throw new _apolloServerExpress.UserInputError(_errors.default.USER_DUPLICATION);
      const password = await _bcrypt.default.hash(args.password, 12);
      const user = await _shortcut.user.create({
        username: args.username,
        full_name: args.full_name,
        password: password
      });

      if (args.labels_name) {
        const labels = await _shortcut.label.findAllWithCondition({
          label_name: args.labels_name
        });
        await user.setLabels(labels);
      }

      if (args.subjects_name) {
        const subjects = await _shortcut.subject.findAllWithCondition({
          subject_name: args.subjects_name
        });
        await user.setSubjects(subjects);
      }

      const role = await _shortcut.role.findBy({
        role_name: args.role_name
      });
      if (!role) throw new _apolloServerExpress.UserInputError(_errors.default.DEFAULT);
      await user.setRole(role);
      return (0, _relationMapper.userObject)(user);
    },
    deleteUser: async (_parent, args, context) => {
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerExpress.ForbiddenError(_errors.default.NOT_LOGGED);
      const loggedUser = await _shortcut.user.findWithRole(context.id);
      await (0, _authorization.checkIsAdmin)(loggedUser);
      const user = await _shortcut.user.find(args.id);
      if (!user) throw new _apolloServerExpress.UserInputError(_errors.default.DEFAULT);
      await user.update({
        deleted_at: Date.now()
      });
      return true;
    },
    destroyUser: async (_parent, args, context) => {
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerExpress.ForbiddenError(_errors.default.NOT_LOGGED);
      const loggedUser = await _shortcut.user.findWithRole(context.id);
      await (0, _authorization.checkIsAdmin)(loggedUser);
      const user = await _shortcut.user.findDeleted(args.id);
      if (!user) throw new _apolloServerExpress.UserInputError(_errors.default.DEFAULT);
      await user.destroy();
      return true;
    },

    /* +---------------------------------------------+ Label */
    addLabel: async (_parent, args, context) => {
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerExpress.ForbiddenError(_errors.default.NOT_LOGGED);
      const loggedUser = await _shortcut.user.findWithRole(context.id);
      await (0, _authorization.checkIsAdmin)(loggedUser);
      const user = await _shortcut.user.find(args.user_id);
      if (!user) throw new _apolloServerExpress.UserInputError(_errors.default.DEFAULT);
      const label = await _shortcut.label.find(args.label_id);
      if (!label) throw new _apolloServerExpress.UserInputError(_errors.default.DEFAULT);
      await user.addLabel(label);
      return true;
    },
    removeLabel: async (_parent, args, context) => {
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerExpress.ForbiddenError(_errors.default.NOT_LOGGED);
      const loggedUser = await _shortcut.user.findWithRole(context.id);
      await (0, _authorization.checkIsAdmin)(loggedUser);
      const user = await _shortcut.user.find(args.user_id);
      if (!user) throw new _apolloServerExpress.UserInputError(_errors.default.DEFAULT);
      const label = await _shortcut.label.find(args.label_id);
      if (!label) throw new _apolloServerExpress.UserInputError(_errors.default.DEFAULT);
      await user.removeLabel(label);
      return true;
    },
    clearLabels: async (_parent, args, context) => {
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerExpress.ForbiddenError(_errors.default.NOT_LOGGED);
      const loggedUser = await _shortcut.user.findWithRole(context.id);
      await (0, _authorization.checkIsAdmin)(loggedUser);
      const user = await _shortcut.user.find(args.user_id);
      if (!user) throw new _apolloServerExpress.UserInputError(_errors.default.DEFAULT);
      await user.removeLabels();
      return true;
    },

    /* +---------------------------------------------+ Subject */
    addSubject: async (_parent, args, context) => {
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerExpress.ForbiddenError(_errors.default.NOT_LOGGED);
      const loggedUser = await _shortcut.user.findWithRole(context.id);
      await (0, _authorization.checkIsAdmin)(loggedUser);
      const user = await _shortcut.user.find(args.user_id);
      if (!user) throw new _apolloServerExpress.UserInputError(_errors.default.DEFAULT);
      const subject = await _shortcut.subject.find(args.subject_id);
      if (!subject) throw new _apolloServerExpress.UserInputError(_errors.default.DEFAULT);
      await user.addSubject(subject);
      return true;
    },
    removeSubject: async (_parent, args, context) => {
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerExpress.ForbiddenError(_errors.default.NOT_LOGGED);
      const loggedUser = await _shortcut.user.findWithRole(context.id);
      await (0, _authorization.checkIsAdmin)(loggedUser);
      const user = await _shortcut.user.find(args.user_id);
      if (!user) throw new _apolloServerExpress.UserInputError(_errors.default.DEFAULT);
      const subject = await _shortcut.subject.find(args.subject_id);
      if (!subject) throw new _apolloServerExpress.UserInputError(_errors.default.DEFAULT);
      await user.removeSubject(subject);
      return true;
    },
    clearSubjects: async (_parent, args, context) => {
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerExpress.ForbiddenError(_errors.default.NOT_LOGGED);
      const loggedUser = await _shortcut.user.findWithRole(context.id);
      await (0, _authorization.checkIsAdmin)(loggedUser);
      const user = await _shortcut.user.find(args.user_id);
      if (!user) throw new _apolloServerExpress.UserInputError(_errors.default.DEFAULT);
      await user.removeSubjects();
      return true;
    },

    /* +---------------------------------------------+ Role */
    setRole: async (_parent, args, context) => {
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerExpress.ForbiddenError(_errors.default.NOT_LOGGED);
      const loggedUser = await _shortcut.user.findWithRole(context.id);
      await (0, _authorization.checkIsAdmin)(loggedUser);
      const user = await _shortcut.user.find(args.user_id);
      if (!user) throw new _apolloServerExpress.UserInputError(_errors.default.DEFAULT);
      const role = await _shortcut.role.find(args.role_id);
      if (!role) throw new _apolloServerExpress.UserInputError(_errors.default.DEFAULT);
      await user.setRole(role);
      return true;
    }
  }
};
exports.resolver = resolver;
//# sourceMappingURL=user.js.map