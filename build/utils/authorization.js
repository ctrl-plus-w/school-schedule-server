"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkIsAdmin = exports.checkIsProfessor = exports.isAdmin = exports.isProfessor = exports.role = void 0;

var _errors = _interopRequireDefault(require("../config/errors"));

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var role = function role(user) {
  return user.role.role_name;
};

exports.role = role;

var isProfessor = function isProfessor(role) {
  return role === _config["default"].ROLES.PROFESSOR || role === _config["default"].ROLES.ADMIN;
};

exports.isProfessor = isProfessor;

var isAdmin = function isAdmin(role) {
  return role === _config["default"].ROLES.ADMIN;
};

exports.isAdmin = isAdmin;

var checkIsProfessor = function checkIsProfessor(user) {
  return new Promise(function (resolve, reject) {
    if (!user) reject(_errors["default"].DEFAULT);
    if (!isProfessor(role(user))) reject(_errors["default"].NOT_ALLOWED);
    resolve();
  });
};

exports.checkIsProfessor = checkIsProfessor;

var checkIsAdmin = function checkIsAdmin(user) {
  return new Promise(function (resolve, reject) {
    if (!user) reject(_errors["default"].DEFAULT);
    if (!isAdmin(role(user))) reject(_errors["default"].NOT_ALLOWED);
    resolve();
  });
};

exports.checkIsAdmin = checkIsAdmin;
//# sourceMappingURL=authorization.js.map