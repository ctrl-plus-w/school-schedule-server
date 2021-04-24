"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = exports.typeDefs = void 0;

var _lodash = require("lodash");

var _apolloServerCore = require("apollo-server-core");

var _user = require("./user");

var _label = require("./label");

var _auth = require("./auth");

var _role = require("./role");

var _subject = require("./subject");

var _event = require("./event");

var _templateObject, _templateObject2;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

// TODO : [x] Set findAll with { where: { deleted_at: null }}
var Query = (0, _apolloServerCore.gql)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  type Query {\n    _empty: String\n  }\n"])));
var Mutation = (0, _apolloServerCore.gql)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  type Mutation {\n    _empty: String\n  }\n"])));
var typeDefs = [Query, Mutation, _user.typeDefs, _label.typeDefs, _auth.typeDefs, _role.typeDefs, _subject.typeDefs, _event.typeDefs];
exports.typeDefs = typeDefs;
var resolvers = (0, _lodash.merge)(_user.resolver, _label.resolvers, _auth.resolvers, _role.resolvers, _subject.resolvers, _event.resolvers);
exports.resolvers = resolvers;
//# sourceMappingURL=index.js.map