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

const typeDefs = (0, _apolloServerCore.gql)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  extend type Query {\n    subject(id: ID!): Subject!\n    subjects: [Subject!]\n  }\n\n  extend type Mutation {\n    createSubject(input: SubjectInput): Subject!\n\n    deleteSubject(id: ID!): Boolean\n\n    destroySubject(id: ID!): Boolean\n  }\n\n  input SubjectInput {\n    subject_name: String!\n    color: String!\n  }\n\n  type Subject {\n    id: ID!\n    subject_name: String!\n    color: String!\n    users: [User!]\n    created_at: String!\n    updated_at: String\n    deleted_at: String\n  }\n"])));
exports.typeDefs = typeDefs;
const resolvers = {
  Query: {
    subject: async (_parent, args) => {
      const subject = await _shortcut.subject.find(args.subject_id);
      return subject ? (0, _relationMapper.getObjectWithUsers)(subject) : null;
    },
    subjects: async () => {
      const subjects = await _shortcut.subject.findAll();
      return subjects.map(_relationMapper.getObjectWithUsers);
    }
  },
  Mutation: {
    createSubject: async (_parent, _ref, context) => {
      let {
        input: args
      } = _ref;
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerCore.ForbiddenError(_errors.default.NOT_ALLOWED);
      const loggedUser = await _shortcut.user.findWithRole(context.id);
      await (0, _authorization.checkIsAdmin)(loggedUser);
      const subjectExist = await _shortcut.subject.findByName(args.subject_name);
      if (subjectExist) throw new _apolloServerCore.UserInputError(_errors.default.SUBJECT_DUPLICATION);
      const subject = await _shortcut.subject.create({
        subject_name: args.subject_name,
        color: args.color
      });
      return (0, _relationMapper.getObjectWithUsers)(subject);
    },
    deleteSubject: async (_parent, args, context) => {
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerCore.ForbiddenError(_errors.default.NOT_ALLOWED);
      const loggedUser = await _shortcut.user.findWithRole(context.id);
      await (0, _authorization.checkIsAdmin)(loggedUser);
      const subject = await _shortcut.subject.find(args.id, _database.default.models.user);
      if (!subject) throw new _apolloServerCore.UserInputError(_errors.default.DEFAULT);
      if ((subject === null || subject === void 0 ? void 0 : subject.users.length) > 0) throw new _apolloServerCore.UserInputError(_errors.default.SUBJECT_CASCADE);
      await subject.update({
        deleted_at: Date.now()
      });
      return true;
    },
    destroySubject: async (_parent, args, context) => {
      if (!(context !== null && context !== void 0 && context.id)) throw new _apolloServerCore.ForbiddenError(_errors.default.NOT_ALLOWED);
      const loggedUser = await _shortcut.user.findWithRole(context.id);
      await (0, _authorization.checkIsAdmin)(loggedUser);
      const subject = await _shortcut.subject.findDeleted(args.id, _database.default.models.user);
      if (!subject) throw new _apolloServerCore.UserInputError(_errors.default.DEFAULT);
      if ((subject === null || subject === void 0 ? void 0 : subject.users.length) > 0) throw new _apolloServerCore.UserInputError(_errors.default.SUBJECT_CASCADE);
      await subject.destroy();
      return true;
    }
  }
};
exports.resolvers = resolvers;
//# sourceMappingURL=subject.js.map