"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
    var req, authHeader, token, decodedToken;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            req = _ref.req;
            _context.next = 3;
            return req.get('Authorization');

          case 3:
            authHeader = _context.sent;

            if (authHeader) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", {
              auth: false
            });

          case 6:
            _context.next = 8;
            return authHeader.split(' ')[1];

          case 8:
            token = _context.sent;

            if (!(!token || token === '')) {
              _context.next = 11;
              break;
            }

            return _context.abrupt("return", {
              auth: false
            });

          case 11:
            _context.prev = 11;
            decodedToken = _jsonwebtoken["default"].verify(token, _config["default"].JWT_KEY);

            if (decodedToken) {
              _context.next = 15;
              break;
            }

            return _context.abrupt("return", {
              auth: false
            });

          case 15:
            return _context.abrupt("return", {
              auth: true,
              id: decodedToken.id,
              role: decodedToken.role,
              full_name: decodedToken.full_name,
              token: token
            });

          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](11);
            return _context.abrupt("return", {
              auth: false
            });

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[11, 18]]);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports["default"] = _default;
//# sourceMappingURL=is-auth.js.map