"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var config = {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  JWT_KEY: process.env.JWT_KEY,
  JWT_TOKEN_EXPIRATION: 1,
  ROLES: {
    PROFESSOR: 'Enseignant',
    STUDENT: 'Élève',
    ADMIN: 'Admin'
  }
};
var _default = config;
exports["default"] = _default;
//# sourceMappingURL=index.js.map