"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUsers = exports.getSubjects = exports.getRole = exports.getLabels = exports.eventObject = exports.userObject = exports.getObjectWithUsers = void 0;

require("core-js/modules/web.url.to-json.js");

require("core-js/modules/es.promise.js");

var _date = require("./date");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const getObjectWithUsers = object => _objectSpread(_objectSpread(_objectSpread({}, object.toJSON()), (0, _date.getDates)(object)), {}, {
  users: () => getUsers(object)
});

exports.getObjectWithUsers = getObjectWithUsers;

const userObject = user => _objectSpread(_objectSpread(_objectSpread({}, user.toJSON()), (0, _date.getDates)(user)), {}, {
  subjects: () => getSubjects(user),
  role: () => getRole(user),
  labels: () => getLabels(user)
});

exports.userObject = userObject;

const eventObject = event => _objectSpread(_objectSpread(_objectSpread({}, event.toJSON()), (0, _date.getDates)(event)), {}, {
  start: new Date(event.toJSON().start).toISOString(),
  owner: () => getUser(event),
  label: () => getLabel(event),
  subject: () => getSubject(event)
});

exports.eventObject = eventObject;

const getLabel = async model => {
  const label = await model.getLabel();
  return label ? getObjectWithUsers(label) : null;
};

const getSubject = async model => {
  const subject = await model.getSubject();
  return subject ? getObjectWithUsers(subject) : null;
};

const getUser = async model => {
  const user = await model.getUser();
  return user ? userObject(user) : null;
};

const getLabels = async model => {
  const labels = await model.getLabels();
  return labels.map(getObjectWithUsers);
};

exports.getLabels = getLabels;

const getRole = async model => {
  const role = await model.getRole();
  return role ? getObjectWithUsers(role) : null;
};

exports.getRole = getRole;

const getSubjects = async model => {
  const subjects = await model.getSubjects();
  return subjects.map(getObjectWithUsers);
};

exports.getSubjects = getSubjects;

const getUsers = async model => {
  const users = await model.getUsers();
  return users.map(userObject);
};

exports.getUsers = getUsers;
//# sourceMappingURL=relationMapper.js.map