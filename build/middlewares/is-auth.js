"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

require("core-js/modules/es.string.split.js");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = async (_ref) => {
  let {
    req
  } = _ref;
  const authHeader = await req.get('Authorization');
  if (!authHeader) return {
    auth: false
  };
  const token = await authHeader.split(' ')[1];
  if (!token || token === '') return {
    auth: false
  };

  try {
    const decodedToken = _jsonwebtoken.default.verify(token, _config.default.JWT_KEY);

    if (!decodedToken) return {
      auth: false
    };
    return {
      auth: true,
      id: decodedToken.id,
      role: decodedToken.role,
      full_name: decodedToken.full_name,
      token: token
    };
  } catch (err) {
    return {
      auth: false
    };
  }
};

exports.default = _default;
//# sourceMappingURL=is-auth.js.map