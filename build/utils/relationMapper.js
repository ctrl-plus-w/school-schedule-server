"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUsers = exports.getSubjects = exports.getRole = exports.getLabels = exports.eventObject = exports.userObject = exports.getObjectWithUsers = void 0;

var _date = require("./date");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getObjectWithUsers = function getObjectWithUsers(object) {
  return _objectSpread(_objectSpread(_objectSpread({}, object.toJSON()), (0, _date.getDates)(object)), {}, {
    users: function users() {
      return getUsers(object);
    }
  });
};

exports.getObjectWithUsers = getObjectWithUsers;

var userObject = function userObject(user) {
  return _objectSpread(_objectSpread(_objectSpread({}, user.toJSON()), (0, _date.getDates)(user)), {}, {
    subjects: function subjects() {
      return getSubjects(user);
    },
    role: function role() {
      return getRole(user);
    },
    labels: function labels() {
      return getLabels(user);
    }
  });
};

exports.userObject = userObject;

var eventObject = function eventObject(event) {
  return _objectSpread(_objectSpread(_objectSpread({}, event.toJSON()), (0, _date.getDates)(event)), {}, {
    start: new Date(event.toJSON().start).toISOString(),
    owner: function owner() {
      return getUser(event);
    },
    label: function label() {
      return getLabel(event);
    },
    subject: function subject() {
      return getSubject(event);
    }
  });
};

exports.eventObject = eventObject;

var getLabel = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(model) {
    var label;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return model.getLabel();

          case 2:
            label = _context.sent;
            return _context.abrupt("return", label ? getObjectWithUsers(label) : null);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getLabel(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getSubject = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(model) {
    var subject;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return model.getSubject();

          case 2:
            subject = _context2.sent;
            return _context2.abrupt("return", subject ? getObjectWithUsers(subject) : null);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getSubject(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var getUser = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(model) {
    var user;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return model.getUser();

          case 2:
            user = _context3.sent;
            return _context3.abrupt("return", user ? userObject(user) : null);

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getUser(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var getLabels = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(model) {
    var labels;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return model.getLabels();

          case 2:
            labels = _context4.sent;
            return _context4.abrupt("return", labels.map(getObjectWithUsers));

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function getLabels(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

exports.getLabels = getLabels;

var getRole = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(model) {
    var role;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return model.getRole();

          case 2:
            role = _context5.sent;
            return _context5.abrupt("return", role ? getObjectWithUsers(role) : null);

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function getRole(_x5) {
    return _ref5.apply(this, arguments);
  };
}();

exports.getRole = getRole;

var getSubjects = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(model) {
    var subjects;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return model.getSubjects();

          case 2:
            subjects = _context6.sent;
            return _context6.abrupt("return", subjects.map(getObjectWithUsers));

          case 4:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function getSubjects(_x6) {
    return _ref6.apply(this, arguments);
  };
}();

exports.getSubjects = getSubjects;

var getUsers = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(model) {
    var users;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return model.getUsers();

          case 2:
            users = _context7.sent;
            return _context7.abrupt("return", users.map(userObject));

          case 4:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function getUsers(_x7) {
    return _ref7.apply(this, arguments);
  };
}();

exports.getUsers = getUsers;
//# sourceMappingURL=relationMapper.js.map