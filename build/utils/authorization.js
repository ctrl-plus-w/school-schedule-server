"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkIsAdmin = exports.checkIsProfessor = exports.isAdmin = exports.isProfessor = exports.role = void 0;

require("core-js/modules/es.promise.js");

var _errors = _interopRequireDefault(require("../config/errors"));

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const role = user => user.role.role_name;

exports.role = role;

const isProfessor = role => role === _config.default.ROLES.PROFESSOR || role === _config.default.ROLES.ADMIN;

exports.isProfessor = isProfessor;

const isAdmin = role => role === _config.default.ROLES.ADMIN;

exports.isAdmin = isAdmin;

const checkIsProfessor = user => {
  return new Promise((resolve, reject) => {
    if (!user) reject(_errors.default.DEFAULT);
    if (!isProfessor(role(user))) reject(_errors.default.NOT_ALLOWED);
    resolve();
  });
};

exports.checkIsProfessor = checkIsProfessor;

const checkIsAdmin = user => {
  return new Promise((resolve, reject) => {
    if (!user) reject(_errors.default.DEFAULT);
    if (!isAdmin(role(user))) reject(_errors.default.NOT_ALLOWED);
    resolve();
  });
};

exports.checkIsAdmin = checkIsAdmin;
//# sourceMappingURL=authorization.js.map