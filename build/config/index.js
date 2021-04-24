"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const config = {
  DB_URL: process.env.DB_URL || 'mysql://be81d03880e29d:ce6f9863@eu-cdbr-west-01.cleardb.com/heroku_c120ac68efd40ef?reconnect=true',
  JWT_KEY: process.env.JWT_KEY || '6e;@B"7UdSyE5!s:',
  JWT_TOKEN_EXPIRATION: 1,
  ROLES: {
    PROFESSOR: 'Enseignant',
    STUDENT: 'Élève',
    ADMIN: 'Admin'
  }
};
var _default = config;
exports.default = _default;
//# sourceMappingURL=index.js.map